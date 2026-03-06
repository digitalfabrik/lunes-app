import { SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'

// 0.80 (vs 0.85) allows for suffix-dropping on long compound words, e.g.
// "das Linsenknöchel" (similarity 0.818) for "das Linsenknöchelchen".
const FULL_PHRASE_SIMILARITY_THRESHOLD = 0.8
// Slightly lower threshold for comparing the transcript against the word portion
// only (when the article was dropped). Used for both single-word vocabulary
// ("Kleinhinz" → "Kleinhirn", similarity ≈ 0.78) and multi-word vocabulary
// ("äußere Umhündung" → "äußere Umhüllung", similarity ≈ 0.89).
const WORD_ONLY_SIMILARITY_THRESHOLD = 0.75
const WORD_SIMILARITY_THRESHOLD = 0.8
// Minimum fraction of the expected phrase that a prefix transcript must cover.
// iOS SFSpeechRecognizer reliably truncates at morpheme boundaries in German
// compound words (e.g. "das Fingerglied" → "Das Finger", 66.7% coverage).
// 0.65 accepts these morpheme-boundary truncations while still rejecting
// transcripts that are too short to be unambiguous (e.g. "die rechte" at 50%
// for "die rechte Vorkammer", where the noun is entirely missing).
const PHRASE_PREFIX_THRESHOLD = 0.65
// Minimum fraction of the expected last token that the transcript's last token
// must cover for the token-level prefix check. Handles cases where iOS truncates
// exactly at a morpheme boundary (e.g. "die Haarwurzel" → "Die Haar":
// last token "har" covers 3/9 = 33% of "harwurzel").
const LAST_TOKEN_PREFIX_THRESHOLD = 0.33
// Minimum similarity between the transcript's last token and the corresponding
// same-length prefix of the expected last token. A strict startsWith check misses
// near-misses like "die Harz" for "die Haarwurzel" ("harz" vs "harw", similarity 0.75).
const LAST_TOKEN_PREFIX_SIMILARITY_THRESHOLD = 0.75

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9 ]/g, '')
    // "th" in German loanwords (Greek/Latin origin: "Stethoskop", "Thermometer") is
    // pronounced as plain "t". Normalizing it prevents ASR from returning "steht" for
    // "Stethoskop" being treated as a mismatch.
    .replace(/th/g, 't')
    // Silent vowel-lengthening "h" (e.g. "steht" → "stet", "Naht" → "nat").
    // The 'h' is not pronounced; removing it makes the transcript "steht" align with
    // the "stet" prefix of the normalized "Stethoskop" → "stetoskop".
    .replace(/([aeiou])h(?=[^aeiou]|$)/g, '$1')
    // Whisper often drops geminate (doubled) consonants, e.g. "Kanne" → "Kana".
    // Collapsing runs on both sides makes the comparison robust to this.
    .replace(/(.)\1+/g, '$1')

const initDpCell = (i: number, j: number): number => {
  if (i === 0) {
    return j
  }
  if (j === 0) {
    return i
  }
  return 0
}

const levenshteinDistance = (a: string, b: string): number => {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (__, j) => initDpCell(i, j)),
  )

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
  }
  return dp[m][n]
}

const stringSimilarity = (a: string, b: string): number => {
  if (a === b) {
    return 1
  }
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) {
    return 1
  }
  return 1 - levenshteinDistance(a, b) / maxLen
}

// Returns true if the tokens of phrase appear as a contiguous sequence within
// the tokens of transcript, allowing at most MAX_EXTRA_TOKENS extra tokens.
// Used to handle Whisper prefixing a filler word such as "Und der Arm" for
// "der Arm", while rejecting hallucinated full sentences that happen to contain
// the expected phrase (e.g. "und die Bauchspeicheldrüse nicht zu nehmen").
const MAX_EXTRA_TOKENS = 2
const containsPhraseTokens = (transcript: string, phrase: string): boolean => {
  const transcriptTokens = transcript.split(' ')
  const phraseTokens = phrase.split(' ')
  if (transcriptTokens.length - phraseTokens.length > MAX_EXTRA_TOKENS) {
    return false
  }
  return transcriptTokens.some((_, i) => phraseTokens.every((token, j) => transcriptTokens[i + j] === token))
}

// Evaluates a single transcript candidate against the expected article + word.
// Returns:
//   'correct'   if the normalized full phrase similarity is ≥ FULL_PHRASE_SIMILARITY_THRESHOLD,
//               or the expected phrase tokens appear verbatim inside the transcript,
//               or the transcript closely approximates the word alone (≥ WORD_ONLY_SIMILARITY_THRESHOLD),
//               or the transcript is a prefix of the full phrase (VAD cut off mid-word)
//   'similar'   if any transcript token matches the word with ≥ WORD_SIMILARITY_THRESHOLD (article wrong)
//   'incorrect' otherwise
const evaluateCandidate = (transcript: string, article: string, word: string): SimpleResult => {
  const normalizedFull = normalizeText(`${article} ${word}`)
  const normalizedWord = normalizeText(word)
  const normalizedTranscript = normalizeText(transcript)

  if (stringSimilarity(normalizedTranscript, normalizedFull) >= FULL_PHRASE_SIMILARITY_THRESHOLD) {
    return SIMPLE_RESULTS.correct
  }

  // The VAD sometimes cuts off the last syllable(s) of a long compound word, producing a
  // transcript that is a clean prefix of the expected phrase (e.g. "das zungenb" for
  // "das Zungenbein"). Accept as correct when the transcript covers ≥ 70% of the phrase.
  // The startsWith guard means a wrong word can never accidentally satisfy this check.
  if (
    normalizedFull.startsWith(normalizedTranscript) &&
    normalizedTranscript.length >= normalizedFull.length * PHRASE_PREFIX_THRESHOLD
  ) {
    return SIMPLE_RESULTS.correct
  }

  // iOS SFSpeechRecognizer sometimes splits German compound words into their constituent
  // parts with spaces (e.g. "Zwölffingerdarm" → "Zwölf Finger"). Joining the transcript
  // tokens without spaces and re-applying geminate collapse handles the new adjacent
  // doubles at word boundaries (e.g. "zwoelf"+"finger" → "zwoelffinger" → "zwoelfinger"),
  // then the same prefix check is applied against the space-removed expected phrase.
  const joinedTranscript = normalizedTranscript.replace(/ /g, '').replace(/(.)\1+/g, '$1')
  const joinedFull = normalizedFull.replace(/ /g, '').replace(/(.)\1+/g, '$1')
  if (
    joinedFull.startsWith(joinedTranscript) &&
    joinedTranscript.length >= joinedFull.length * PHRASE_PREFIX_THRESHOLD
  ) {
    return SIMPLE_RESULTS.correct
  }

  // iOS SFSpeechRecognizer sometimes truncates exactly at a morpheme boundary, returning
  // only the first morpheme of the final compound token (e.g. "die Haarwurzel" →
  // "Die Haar": last token "har" covers just 33% of "harwurzel"). The whole-phrase prefix
  // check at 65% can't catch these cases, so we apply a per-token check instead.
  // Requirements: same token count (prevents "die rechte" for "die rechte Vorkammer"
  // where the noun is absent), all preceding tokens match exactly (prevents wrong-article
  // answers), and the last transcript token is a prefix of the expected last token.
  const transcriptTokens = normalizedTranscript.split(' ').filter(t => t.length > 0)
  const fullTokens = normalizedFull.split(' ').filter(t => t.length > 0)
  if (transcriptTokens.length === fullTokens.length && transcriptTokens.length > 1) {
    const allPrecedingMatch = transcriptTokens.slice(0, -1).every((token, i) => token === fullTokens[i])
    if (allPrecedingMatch) {
      const lastTranscriptToken = transcriptTokens[transcriptTokens.length - 1]
      const lastFullToken = fullTokens[fullTokens.length - 1]
      if (
        lastTranscriptToken.length >= lastFullToken.length * LAST_TOKEN_PREFIX_THRESHOLD &&
        lastTranscriptToken.length <= lastFullToken.length
      ) {
        const expectedPrefix = lastFullToken.slice(0, lastTranscriptToken.length)
        if (stringSimilarity(lastTranscriptToken, expectedPrefix) >= LAST_TOKEN_PREFIX_SIMILARITY_THRESHOLD) {
          return SIMPLE_RESULTS.correct
        }
      }
    }
  }

  // Whisper sometimes prefixes/appends extra words (e.g. "Und der Arm" for "der Arm").
  // Accept as correct if the expected phrase tokens appear as a contiguous subsequence.
  if (containsPhraseTokens(normalizedTranscript, normalizedFull)) {
    return SIMPLE_RESULTS.correct
  }

  // ASR models may drop short German articles (die/der/das).
  // If the transcript is exactly the expected word, count it as correct.
  if (normalizedTranscript === normalizedWord) {
    return SIMPLE_RESULTS.correct
  }

  // Fuzzy version of the article-dropping check above: accept as correct when
  // the full transcript closely approximates the word portion alone.
  // Applies to both single-word vocabulary ("Kleinhinz" for "Kleinhirn") and
  // multi-word vocabulary ("äußere Umhündung" for "äußere Umhüllung").
  // The slightly lower threshold compensates for model-specific phoneme
  // substitutions at word endings (e.g. "rn" → "nz").
  if (stringSimilarity(normalizedTranscript, normalizedWord) >= WORD_ONLY_SIMILARITY_THRESHOLD) {
    return SIMPLE_RESULTS.correct
  }

  const transcriptParts = normalizedTranscript.split(' ')
  const bestWordSimilarity = Math.max(...transcriptParts.map(part => stringSimilarity(part, normalizedWord)))
  if (bestWordSimilarity >= WORD_SIMILARITY_THRESHOLD) {
    return SIMPLE_RESULTS.similar
  }

  return SIMPLE_RESULTS.incorrect
}

// Takes all transcript candidates and returns the best result (correct > similar > incorrect).
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
