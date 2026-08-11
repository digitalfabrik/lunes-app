import { Article, ARTICLES, hasNoArticle, SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'

// --- Matching thresholds ---
// Change these as Automatic Speech Recognition (ASR) quality improves or new failure modes are discovered.

// A single misheard letter in a short word ("das Kleinhinz" for "das Kleinhirn") already costs 0.846.
const FULL_PHRASE_SIMILARITY_THRESHOLD = 0.8

// Maximum number of extra tokens allowed in the transcript for the token-embedding check
const MAX_EXTRA_TOKENS = 2

// A German syllable has exactly one vowel nucleus, so counting maximal vowel runs counts syllables.
// Accented vowels belong to the class because the ASR spells loanwords both ways ("das Café" and
// "das Cafe" must both count as three syllables).
const VOWEL_NUCLEUS_PATTERN = /[aeiouyäöüáàâéèêíìîóòôúùû]+/g

const SPOKEN_ARTICLES: readonly string[] = ARTICLES.filter(article => !hasNoArticle(article)).map(
  article => article.value,
)

export const SPEECH_FEEDBACK_REASONS = {
  missingArticle: 'missingArticle',
  wrongArticle: 'wrongArticle',
  incompleteWord: 'incompleteWord',
} as const
export type SpeechFeedbackReason = (typeof SPEECH_FEEDBACK_REASONS)[keyof typeof SPEECH_FEEDBACK_REASONS]

export type SpeechMatch = {
  result: SimpleResult
  reason?: SpeechFeedbackReason
}

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9 ]/g, '')
    // "th" in German loanwords (Greek/Latin origin: "Stethoskop") is pronounced as plain "t"
    .replace(/th/g, 't')
    // Silent vowel-lengthening "h" (e.g. "steht" → "stet", "Naht" → "nat") is not pronounced
    .replace(/([aeiou])h(?=[^aeiou]|$)/g, '$1')
    // Automatic Speech Recognition models often drop geminate consonants (e.g. "Kanne" → "Kana")
    // collapsing runs on both sides makes the comparison robust to this
    .replace(/(.)\1+/g, '$1')

// Counted on the raw text so that the count does not depend on the order of steps in normalizeText,
// which expands umlauts and drops silent letters.
const countSyllableNuclei = (text: string): number => (text.toLowerCase().match(VOWEL_NUCLEUS_PATTERN) ?? []).length

// https://en.wikipedia.org/wiki/Levenshtein_distance
const levenshteinDistance = (source: string, target: string): number => {
  const sourceLength = source.length
  const targetLength = target.length
  const distances: number[][] = Array.from({ length: sourceLength + 1 }, (_, row) =>
    Array.from({ length: targetLength + 1 }, (_, column) => {
      if (row === 0) {
        return column
      }
      if (column === 0) {
        return row
      }
      return 0
    }),
  )

  for (let sourceIndex = 1; sourceIndex <= sourceLength; sourceIndex += 1) {
    for (let targetIndex = 1; targetIndex <= targetLength; targetIndex += 1) {
      if (source[sourceIndex - 1] === target[targetIndex - 1]) {
        distances[sourceIndex]![targetIndex] = distances[sourceIndex - 1]![targetIndex - 1]!
      } else {
        const deletion = distances[sourceIndex - 1]![targetIndex]!
        const insertion = distances[sourceIndex]![targetIndex - 1]!
        const substitution = distances[sourceIndex - 1]![targetIndex - 1]!
        distances[sourceIndex]![targetIndex] = 1 + Math.min(deletion, insertion, substitution)
      }
    }
  }
  return distances[sourceLength]![targetLength]!
}

const stringSimilarity = (first: string, second: string): number => {
  if (first === second) {
    return 1
  }
  return 1 - levenshteinDistance(first, second) / Math.max(first.length, second.length)
}

// Removes spaces and re-collapses geminates that appear at word boundaries after joining, so that a
// compound the recognizer split into separate tokens still matches ("Zwölffinger Darm" → "zwoelfingerdarm").
const joinTokens = (text: string): string => text.replace(/ /g, '').replace(/(.)\1+/g, '$1')

const isSimilar = (transcript: string, expected: string): boolean =>
  stringSimilarity(joinTokens(transcript), joinTokens(expected)) >= FULL_PHRASE_SIMILARITY_THRESHOLD

// Handles filler words prepended by the speech recognizer (e.g. "Und der Arm" for "der Arm").
// The token-level check ensures the expected phrase appears as whole words, not as a substring
// of a longer word (so "der Armband" does not match "der Arm"). It demands an exact match, so unlike
// the similarity path it can never absorb a dropped syllable and needs no syllable check.
const containsAsTokens = (transcript: string, expected: string, maxExtra: number): boolean => {
  const transcriptTokens = transcript.split(' ')
  const expectedTokens = expected.split(' ')

  if (transcriptTokens.length - expectedTokens.length > maxExtra) {
    return false
  }

  const expectedPhrase = expectedTokens.join(' ')
  return transcriptTokens.some((_, startIndex) => {
    const candidatePhrase = transcriptTokens.slice(startIndex, startIndex + expectedTokens.length).join(' ')
    return candidatePhrase === expectedPhrase
  })
}

const tokensOf = (text: string): string[] => text.split(' ').filter(token => token.length > 0)

const spokenArticleOf = (transcript: string): string | null => {
  const [firstToken] = tokensOf(transcript)
  return firstToken !== undefined && SPOKEN_ARTICLES.includes(firstToken) ? firstToken : null
}

const withoutSpokenArticle = (transcript: string): string =>
  spokenArticleOf(transcript) === null ? transcript : tokensOf(transcript).slice(1).join(' ')

const incorrect = (reason?: SpeechFeedbackReason): SpeechMatch => ({ result: SIMPLE_RESULTS.incorrect, reason })

const evaluateCandidate = (transcript: string, article: Article, word: string): SpeechMatch => {
  const expectedPhrase = hasNoArticle(article) ? word : `${article.value} ${word}`
  const normalizedTranscript = normalizeText(transcript)
  const normalizedExpected = normalizeText(expectedPhrase)

  if (containsAsTokens(normalizedTranscript, normalizedExpected, MAX_EXTRA_TOKENS)) {
    return { result: SIMPLE_RESULTS.correct }
  }

  // Only used to decide whether an article hint would be helpful: saying something entirely different
  // should not be reported as a missing article.
  const spokenWord = withoutSpokenArticle(normalizedTranscript)
  const isWordItself =
    countSyllableNuclei(spokenWord) === countSyllableNuclei(word) && isSimilar(spokenWord, normalizeText(word))

  const spokenArticle = spokenArticleOf(normalizedTranscript)
  if (!hasNoArticle(article)) {
    if (spokenArticle === null) {
      return incorrect(isWordItself ? SPEECH_FEEDBACK_REASONS.missingArticle : undefined)
    }
    if (spokenArticle !== normalizeText(article.value)) {
      return incorrect(isWordItself ? SPEECH_FEEDBACK_REASONS.wrongArticle : undefined)
    }
  }

  // Items without an article are graded on the word alone, so an article the recognizer added by
  // itself is ignored instead of being counted against the answer.
  const comparableTranscript = hasNoArticle(article) ? spokenWord : normalizedTranscript

  // A dropped syllable barely moves the length-normalized similarity of a long compound
  // ("die Bodenheizung" for "die Fußbodenheizung" still scores 0.842), but it always changes the
  // syllable count. Comparing the counts is the only way to tell an omitted syllable apart from a
  // misheard consonant, which costs the same number of edits.
  const spokenSyllables = countSyllableNuclei(comparableTranscript)
  const expectedSyllables = countSyllableNuclei(expectedPhrase)
  if (spokenSyllables < expectedSyllables) {
    return incorrect(SPEECH_FEEDBACK_REASONS.incompleteWord)
  }
  if (spokenSyllables > expectedSyllables) {
    return incorrect()
  }

  return isSimilar(comparableTranscript, normalizedExpected) ? { result: SIMPLE_RESULTS.correct } : incorrect()
}

// Takes all transcript candidates and returns the best result. The candidates are alternates of one
// utterance, so a single matching hypothesis is enough. Otherwise the first reason wins, since both
// platforms return their hypotheses ordered by confidence.
export const evaluateSpeechMatch = (transcriptResults: string[], article: Article, word: string): SpeechMatch => {
  const matches = transcriptResults.map(transcript => evaluateCandidate(transcript, article, word))

  if (matches.some(match => match.result === SIMPLE_RESULTS.correct)) {
    return { result: SIMPLE_RESULTS.correct }
  }
  return incorrect(matches.find(match => match.reason !== undefined)?.reason)
}
