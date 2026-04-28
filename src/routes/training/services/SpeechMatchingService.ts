import { SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'

// --- Matching thresholds ---
// Change these as Automatic Speech Recognition (ASR) quality improves or new failure modes are discovered.

// Slightly lower than 0.85 to allow suffix-dropping on long compounds
// (e.g. "das Linsenknöchel" for "das Linsenknöchelchen", similarity 0.818)
const FULL_PHRASE_SIMILARITY_THRESHOLD = 0.8

// Slightly lower than the full-phrase threshold since the article is more likely
// to be dropped or misheard by the Automatic Speech Recognition (ASR)
const WORD_ONLY_SIMILARITY_THRESHOLD = 0.75

// Minimum fraction of the space-collapsed expected phrase that the collapsed transcript must cover.
// 0.65 accepts "Zwölf Finger" for "Zwölffingerdarm" (zwoelfinger/zwoelfingerdarm = 79%)
// while rejecting "Zwölf" alone (zwoelf/zwoelfingerdarm = 43%)
const PHRASE_PREFIX_THRESHOLD = 0.65

// Minimum fraction of the expected last token that the transcript's last token must cover
// 0.33 handles truncation at a morpheme boundary ("Die Haar" for "die Haarwurzel":
// "har" covers 3/9 = 33% of "harwurzel")
const LAST_TOKEN_PREFIX_THRESHOLD = 0.33

// Minimum similarity between the transcript's last token and the same-length prefix of
// the expected last token. Handles near-misses like "harz" vs "harw" (similarity 0.75)
const LAST_TOKEN_PREFIX_SIMILARITY_THRESHOLD = 0.75

// Maximum number of extra tokens allowed in the transcript for the token-embedding check
const MAX_EXTRA_TOKENS = 2

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

const isSimilar = (transcript: string, expected: string, threshold: number): boolean =>
  stringSimilarity(transcript, expected) >= threshold

// Returns true if transcript is a prefix of expected, covering at least the given fraction of it.
const isPhrasePrefix = (transcript: string, expected: string, coverage: number): boolean =>
  expected.startsWith(transcript) && transcript.length >= expected.length * coverage

// Removes spaces and re-collapses geminates that appear at word boundaries after joining.
// e.g. "Zwölf Finger" → "zwoelffinger" → "zwoelfinger"
const joinTokens = (text: string): string => text.replace(/ /g, '').replace(/(.)\1+/g, '$1')

// Handles compound words split into separate tokens: the speech recognizer may transcribe a
// compound as its constituent parts (e.g. "Zwölf Finger" for "Zwölffingerdarm"). Joining the
// tokens and re-collapsing geminates at word boundaries then gives a clean prefix match.
const isCollapsedPhrasePrefix = (transcript: string, expected: string, coverage: number): boolean =>
  isPhrasePrefix(joinTokens(transcript), joinTokens(expected), coverage)

// Handles truncation at a morpheme boundary: the speech recognizer produces the article and the
// start of the noun, but stops partway through the last token (e.g. "Die Haar" for "die Haarwurzel",
// or near-miss "Die Harz" where "harz" ≈ "harw"). Requires at least 2 tokens so that article
// matching is meaningful.
const isLastTokenPartialMatch = (
  transcript: string,
  expected: string,
  minCoverage: number,
  similarity: number,
): boolean => {
  const transcriptTokens = transcript.split(' ').filter(token => token.length > 0)
  const expectedTokens = expected.split(' ').filter(token => token.length > 0)

  if (transcriptTokens.length !== expectedTokens.length || transcriptTokens.length <= 1) {
    return false
  }

  const precedingTokensMatch = transcriptTokens.slice(0, -1).every((token, index) => token === expectedTokens[index])
  if (!precedingTokensMatch) {
    return false
  }

  const lastTranscriptToken = transcriptTokens[transcriptTokens.length - 1]!
  const lastExpectedToken = expectedTokens[expectedTokens.length - 1]!

  if (
    lastTranscriptToken.length < lastExpectedToken.length * minCoverage ||
    lastTranscriptToken.length > lastExpectedToken.length
  ) {
    return false
  }

  const expectedPrefix = lastExpectedToken.slice(0, lastTranscriptToken.length)
  return stringSimilarity(lastTranscriptToken, expectedPrefix) >= similarity
}

// Handles filler words prepended by the speech recognizer (e.g. "Und der Arm" for "der Arm").
// The token-level check ensures the expected phrase appears as whole words, not as a substring
// of a longer word (so "der Armband" does not match "der Arm").
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

const evaluateCandidate = (transcript: string, article: string, word: string): SimpleResult => {
  const normalizedFull = normalizeText(`${article} ${word}`)
  const normalizedWord = normalizeText(word)
  const normalizedTranscript = normalizeText(transcript)

  const isCorrect =
    isSimilar(normalizedTranscript, normalizedFull, FULL_PHRASE_SIMILARITY_THRESHOLD) ||
    isSimilar(normalizedTranscript, normalizedWord, WORD_ONLY_SIMILARITY_THRESHOLD) ||
    isCollapsedPhrasePrefix(normalizedTranscript, normalizedFull, PHRASE_PREFIX_THRESHOLD) ||
    isLastTokenPartialMatch(
      normalizedTranscript,
      normalizedFull,
      LAST_TOKEN_PREFIX_THRESHOLD,
      LAST_TOKEN_PREFIX_SIMILARITY_THRESHOLD,
    ) ||
    containsAsTokens(normalizedTranscript, normalizedFull, MAX_EXTRA_TOKENS)

  return isCorrect ? SIMPLE_RESULTS.correct : SIMPLE_RESULTS.incorrect
}

// Takes all transcript candidates and returns the best result (correct > incorrect)
export const evaluateSpeechMatch = (transcriptResults: string[], article: string, word: string): SimpleResult => {
  if (transcriptResults.length === 0) {
    return SIMPLE_RESULTS.incorrect
  }

  const results = transcriptResults.map(transcript => evaluateCandidate(transcript, article, word))

  if (results.includes(SIMPLE_RESULTS.correct)) {
    return SIMPLE_RESULTS.correct
  }
  return SIMPLE_RESULTS.incorrect
}
