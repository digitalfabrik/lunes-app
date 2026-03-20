import { SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'

// Slightly lower than 0.85 to allow suffix-dropping on long compounds
// (e.g. "das Linsenknöchel" for "das Linsenknöchelchen", similarity 0.818)
const FULL_PHRASE_SIMILARITY_THRESHOLD = 0.8

// Slightly lower than the full-phrase threshold since the article is more likely
// to be dropped or misheard by the Automatic Speech Recognition (ASR)
const WORD_ONLY_SIMILARITY_THRESHOLD = 0.75

// Minimum token similarity to flag as 'similar' (correct word, wrong article)
const WORD_SIMILARITY_THRESHOLD = 0.8

// Minimum fraction of the expected phrase that a prefix transcript must cover
// 0.65 accepts iOS morpheme-boundary truncations ("Das Finger" for "das Fingerglied",
// 66.7%) while rejecting transcripts where the noun is absent ("die rechte" for
// "die rechte Vorkammer", 50%)
const PHRASE_PREFIX_THRESHOLD = 0.65

// Minimum fraction of the expected last token that the transcript's last token must cover
// 0.33 handles iOS truncating at a morpheme boundary ("Die Haar" for "die Haarwurzel":
// "har" covers 3/9 = 33% of "harwurzel")
const LAST_TOKEN_PREFIX_THRESHOLD = 0.33

// Minimum similarity between the transcript's last token and the same-length prefix of
// the expected last token. Handles near-misses like "harz" vs "harw" (similarity 0.75)
const LAST_TOKEN_PREFIX_SIMILARITY_THRESHOLD = 0.75

// Maximum number of extra tokens allowed in the transcript for the phrase-embedding check
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
    Array.from({ length: targetLength + 1 }, (__, column) => {
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
        distances[sourceIndex][targetIndex] = distances[sourceIndex - 1][targetIndex - 1]
      } else {
        const deletion = distances[sourceIndex - 1][targetIndex]
        const insertion = distances[sourceIndex][targetIndex - 1]
        const substitution = distances[sourceIndex - 1][targetIndex - 1]
        distances[sourceIndex][targetIndex] = 1 + Math.min(deletion, insertion, substitution)
      }
    }
  }
  return distances[sourceLength][targetLength]
}

const stringSimilarity = (first: string, second: string): number => {
  if (first === second) {
    return 1
  }
  return 1 - levenshteinDistance(first, second) / Math.max(first.length, second.length)
}

// Returns true if the tokens of phrase appear as a contiguous sequence within the tokens
// of transcript, allowing at most MAX_EXTRA_TOKENS extra tokens. Handles ASR prepending
// filler words (e.g. "Und der Arm" → matches "der Arm") while rejecting transcripts
// that merely contain the phrase as part of a longer utterance
const containsPhraseTokens = (transcript: string, phrase: string): boolean => {
  const transcriptTokens = transcript.split(' ')
  const phraseTokens = phrase.split(' ')
  if (transcriptTokens.length - phraseTokens.length > MAX_EXTRA_TOKENS) {
    return false
  }
  return transcriptTokens.some((_, startIndex) =>
    phraseTokens.every((token, phraseTokenIndex) => transcriptTokens[startIndex + phraseTokenIndex] === token),
  )
}

// Returns true when the transcript is a prefix of the full phrase covering at least
// PHRASE_PREFIX_THRESHOLD of its length. Handles voice activity detection (VAD) cutting off the final syllables
// of long compound words (e.g. "das zungenb" for "das Zungenbein", ~79% coverage)
const isTruncatedPhrase = (normalizedTranscript: string, normalizedFull: string): boolean =>
  normalizedFull.startsWith(normalizedTranscript) &&
  normalizedTranscript.length >= normalizedFull.length * PHRASE_PREFIX_THRESHOLD

// Returns true when the transcript, with spaces and geminates removed, is a prefix of the
// space-removed full phrase. Handles iOS splitting compound words into parts with spaces
// (e.g. "Zwölffingerdarm" → "Zwölf Finger"): joining the tokens and re-collapsing the
// new adjacent geminates at word boundaries gives "zwoelfinger", a prefix of "zwoelfingerdarm"
const isTruncatedJoinedPhrase = (normalizedTranscript: string, normalizedFull: string): boolean => {
  const withoutSpacesAndGeminates = (text: string): string => text.replace(/ /g, '').replace(/(.)\1+/g, '$1')
  const joinedTranscript = withoutSpacesAndGeminates(normalizedTranscript)
  const joinedFull = withoutSpacesAndGeminates(normalizedFull)
  return (
    joinedFull.startsWith(joinedTranscript) && joinedTranscript.length >= joinedFull.length * PHRASE_PREFIX_THRESHOLD
  )
}

// Returns true when iOS truncated the transcript exactly at a morpheme boundary within the
// last token (e.g. "Die Haar" for "die Haarwurzel"). Requirements: same token count (rejects
// cases where a noun is entirely absent), all preceding tokens match exactly (rejects wrong
// articles), and the last transcript token is a fuzzy prefix of the expected last token
const isMorphemeBoundaryTruncation = (normalizedTranscript: string, normalizedFull: string): boolean => {
  const transcriptTokens = normalizedTranscript.split(' ').filter(token => token.length > 0)
  const fullTokens = normalizedFull.split(' ').filter(token => token.length > 0)

  if (transcriptTokens.length !== fullTokens.length || transcriptTokens.length <= 1) {
    return false
  }

  const allPrecedingTokensMatch = transcriptTokens
    .slice(0, -1)
    .every((token, tokenIndex) => token === fullTokens[tokenIndex])
  if (!allPrecedingTokensMatch) {
    return false
  }

  const lastTranscriptToken = transcriptTokens[transcriptTokens.length - 1]
  const lastFullToken = fullTokens[fullTokens.length - 1]

  if (
    lastTranscriptToken.length < lastFullToken.length * LAST_TOKEN_PREFIX_THRESHOLD ||
    lastTranscriptToken.length > lastFullToken.length
  ) {
    return false
  }

  const expectedPrefix = lastFullToken.slice(0, lastTranscriptToken.length)
  return stringSimilarity(lastTranscriptToken, expectedPrefix) >= LAST_TOKEN_PREFIX_SIMILARITY_THRESHOLD
}

const evaluateCandidate = (transcript: string, article: string, word: string): SimpleResult => {
  const normalizedFull = normalizeText(`${article} ${word}`)
  const normalizedWord = normalizeText(word)
  const normalizedTranscript = normalizeText(transcript)

  if (
    stringSimilarity(normalizedTranscript, normalizedFull) >= FULL_PHRASE_SIMILARITY_THRESHOLD ||
    isTruncatedPhrase(normalizedTranscript, normalizedFull) ||
    isTruncatedJoinedPhrase(normalizedTranscript, normalizedFull) ||
    isMorphemeBoundaryTruncation(normalizedTranscript, normalizedFull) ||
    containsPhraseTokens(normalizedTranscript, normalizedFull) ||
    stringSimilarity(normalizedTranscript, normalizedWord) >= WORD_ONLY_SIMILARITY_THRESHOLD
  ) {
    return SIMPLE_RESULTS.correct
  }

  const transcriptParts = normalizedTranscript.split(' ')
  const bestWordSimilarity = Math.max(...transcriptParts.map(part => stringSimilarity(part, normalizedWord)))
  if (bestWordSimilarity >= WORD_SIMILARITY_THRESHOLD) {
    return SIMPLE_RESULTS.similar
  }

  return SIMPLE_RESULTS.incorrect
}

// Takes all transcript candidates and returns the best result (correct > similar > incorrect)
export const evaluateSpeechMatch = (transcriptResults: string[], article: string, word: string): SimpleResult => {
  if (transcriptResults.length === 0) {
    return SIMPLE_RESULTS.incorrect
  }

  const results = transcriptResults.map(transcript => evaluateCandidate(transcript, article, word))

  if (results.includes(SIMPLE_RESULTS.correct)) {
    return SIMPLE_RESULTS.correct
  }
  if (results.includes(SIMPLE_RESULTS.similar)) {
    return SIMPLE_RESULTS.similar
  }
  return SIMPLE_RESULTS.incorrect
}
