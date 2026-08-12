import normalizeStrings from 'normalize-strings'

import { Article, ARTICLES, hasNoArticle, SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'

// Not higher: a single misheard letter in a short word ("das Kleinhinz" for "das Kleinhirn") costs 0.846
const FULL_PHRASE_SIMILARITY_THRESHOLD = 0.8

const MAX_EXTRA_TOKENS = 2

// A German syllable has exactly one vowel nucleus, so counting vowel runs counts syllables. Only plain
// vowels are listed because normalizeText has already folded every accent by the time this is used.
const VOWEL_NUCLEUS_PATTERN = /[aeiouy]+/g

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

// Has to run before normalizeStrings, which would fold "ä" to a plain "a" and lose the pronounced "e"
const expandGermanCharacters = (text: string): string =>
  text.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')

const normalizeText = (text: string): string =>
  normalizeStrings(expandGermanCharacters(text.toLowerCase().trim()))
    // Accents are folded above rather than dropped here, so that "Café" keeps its final syllable
    .replace(/[^a-z0-9 ]/g, '')
    // "th" in German loanwords (Greek/Latin origin: "Stethoskop") is pronounced as plain "t"
    .replace(/th/g, 't')
    // Silent vowel-lengthening "h" (e.g. "steht" → "stet", "Naht" → "nat") is not pronounced
    .replace(/([aeiou])h(?=[^aeiou]|$)/g, '$1')
    // Automatic Speech Recognition models often drop geminate consonants (e.g. "Kanne" → "Kana")
    // collapsing runs on both sides makes the comparison robust to this
    .replace(/(.)\1+/g, '$1')

const SPOKEN_ARTICLES: readonly string[] = ARTICLES.filter(article => !hasNoArticle(article)).map(article =>
  normalizeText(article.value),
)

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

// Lets a compound that the recognizer split into separate tokens still match ("Zwölffinger Darm")
const joinTokens = (text: string): string => text.replace(/ /g, '').replace(/(.)\1+/g, '$1')

const isSimilar = (transcript: string, expected: string): boolean =>
  stringSimilarity(joinTokens(transcript), joinTokens(expected)) >= FULL_PHRASE_SIMILARITY_THRESHOLD

// Expects normalized text, so that both sides of a comparison are always counted in the same shape.
// Spaces are kept: joining tokens first would merge the vowel runs either side of a boundary and hide a
// dropped syllable ("Die kalkungs Anlage" would pass for "die Entkalkungsanlage").
const countSyllables = (normalizedText: string): number => (normalizedText.match(VOWEL_NUCLEUS_PATTERN) ?? []).length

// Handles filler words prepended by the speech recognizer (e.g. "Und der Arm" for "der Arm"). Matching
// whole tokens keeps "der Armband" from matching "der Arm", and demanding an exact match means this path
// can never absorb a dropped syllable, so it needs no syllable check of its own.
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

// Only decides whether an article hint would be helpful: saying something entirely different should not
// be reported as a missing article. Both arguments are normalized.
const looksLikeExpectedWord = (transcriptWord: string, expectedWord: string): boolean =>
  countSyllables(transcriptWord) === countSyllables(expectedWord) && isSimilar(transcriptWord, expectedWord)

const incorrect = (reason?: SpeechFeedbackReason): SpeechMatch => ({ result: SIMPLE_RESULTS.incorrect, reason })

const evaluateCandidate = (transcript: string, article: Article, word: string): SpeechMatch => {
  const expectedPhrase = hasNoArticle(article) ? word : `${article.value} ${word}`
  const normalizedTranscript = normalizeText(transcript)
  const normalizedExpected = normalizeText(expectedPhrase)

  if (containsAsTokens(normalizedTranscript, normalizedExpected, MAX_EXTRA_TOKENS)) {
    return { result: SIMPLE_RESULTS.correct }
  }

  const tokens = tokensOf(normalizedTranscript)
  const [firstToken] = tokens
  const spokenArticle = firstToken !== undefined && SPOKEN_ARTICLES.includes(firstToken) ? firstToken : null
  const spokenWord = spokenArticle === null ? normalizedTranscript : tokens.slice(1).join(' ')

  if (!hasNoArticle(article) && spokenArticle !== normalizeText(article.value)) {
    const reason =
      spokenArticle === null ? SPEECH_FEEDBACK_REASONS.missingArticle : SPEECH_FEEDBACK_REASONS.wrongArticle
    return incorrect(looksLikeExpectedWord(spokenWord, normalizeText(word)) ? reason : undefined)
  }

  // Items without an article are graded on the word alone, so an article the recognizer added by itself
  // is ignored rather than counted against the answer.
  const comparableTranscript = hasNoArticle(article) ? spokenWord : normalizedTranscript

  // A dropped syllable barely moves a long compound's similarity ("die Bodenheizung" for
  // "die Fußbodenheizung" still scores 0.842) but always changes the syllable count, which is the only
  // signal that separates it from a misheard consonant costing the same number of edits.
  const spokenSyllables = countSyllables(comparableTranscript)
  const expectedSyllables = countSyllables(normalizedExpected)
  if (spokenSyllables < expectedSyllables) {
    return incorrect(SPEECH_FEEDBACK_REASONS.incompleteWord)
  }
  if (spokenSyllables > expectedSyllables) {
    return incorrect()
  }

  return isSimilar(comparableTranscript, normalizedExpected) ? { result: SIMPLE_RESULTS.correct } : incorrect()
}

// The candidates are alternates of one utterance, so a single matching hypothesis is enough. Otherwise the
// hint comes from the most confident candidate only — both platforms order their hypotheses by confidence,
// and a hint taken from a lower-ranked alternate can contradict what the top one shows.
export const evaluateSpeechMatch = (transcriptResults: string[], article: Article, word: string): SpeechMatch => {
  const matches = transcriptResults.map(transcript => evaluateCandidate(transcript, article, word))

  if (matches.some(match => match.result === SIMPLE_RESULTS.correct)) {
    return { result: SIMPLE_RESULTS.correct }
  }
  return incorrect(matches[0]?.reason)
}
