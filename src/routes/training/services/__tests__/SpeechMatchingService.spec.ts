import { SIMPLE_RESULTS } from '../../../../constants/data'
import { evaluateSpeechMatch } from '../SpeechMatchingService'

describe('evaluateSpeechMatch', () => {
  describe('when transcript list is empty', () => {
    it('should return incorrect', () => {
      expect(evaluateSpeechMatch([], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when the correct phrase is said exactly', () => {
    it('should return correct for exact match', () => {
      expect(evaluateSpeechMatch(['der Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct regardless of casing', () => {
      expect(evaluateSpeechMatch(['Der Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for exact match with umlauts', () => {
      expect(evaluateSpeechMatch(['die Ärztin'], 'die', 'Ärztin')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when German special characters are transcribed differently', () => {
      expect(evaluateSpeechMatch(['die Aerztin'], 'die', 'Ärztin')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when ß is transcribed as ss', () => {
      expect(evaluateSpeechMatch(['die Strasse'], 'die', 'Straße')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when the pronunciation is close but not exact', () => {
    it('should return correct for a near-miss of the full phrase', () => {
      expect(evaluateSpeechMatch(['der Artzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when a geminate consonant is dropped', () => {
      // Speech recognizers commonly transcribe "Kanne" as "Kana" (geminate nn → single n)
      expect(evaluateSpeechMatch(['Die Kana'], 'die', 'Kanne')).toBe(SIMPLE_RESULTS.correct)
      expect(evaluateSpeechMatch(['die Kasete'], 'die', 'Kassette')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when silent letters cause a transcription mismatch', () => {
      // German "th" (Greek loanword) is pronounced as "t": "Stethoskop" → "stetoskop".
      // German vowel-lengthening "h" is silent: "steht" → "stet".
      // After both normalizations "stet" is a prefix of "stetoskop" at 4/9 = 44% ≥ 33%.
      expect(evaluateSpeechMatch(['Das stet'], 'das', 'Stethoskop')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when the word is only partially recognized', () => {
    it('should return correct when enough of the word was recognized', () => {
      // Voice activity detection may stop recognition before the final syllables of a long
      // compound word (e.g. "das zungenb" instead of "das Zungenbein", ~79% coverage)
      expect(evaluateSpeechMatch(['das zungenb'], 'das', 'Zungenbein')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when a phonetically unusual suffix is not recognized', () => {
      // The "-chien" ending in "Bronchien" is phonetically unusual and the emulator speech recognizer drops it reliably
      expect(evaluateSpeechMatch(['die seitenbron'], 'die', 'Seitenbronchien')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when only a partial root is recognized', () => {
      expect(evaluateSpeechMatch(['der unterl'], 'der', 'Unterlappen')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when recognition stops at a morpheme boundary', () => {
      // iOS Recognizer reliably truncates "Fingerglied" at the first morpheme:
      // "das Fingerglied" → "Das Finger": 10/15 chars = 66.7%, above the 65% threshold.
      expect(evaluateSpeechMatch(['Das Finger'], 'das', 'Fingerglied')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when recognition stops at the start of a compound', () => {
      // iOS gives "Die Haar" for "die Haarwurzel": article matches, token count matches,
      // last token "har" covers 3/9 = 33% of "harwurzel" ≥ LAST_TOKEN_PREFIX_THRESHOLD.
      expect(evaluateSpeechMatch(['Die Haar'], 'die', 'Haarwurzel')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when the start of the compound has minor transcription errors', () => {
      // iOS sometimes returns near-misses like "Die Harz" for "die Haarwurzel":
      // "harz" vs "harw" (first 4 chars of "harwurzel") has similarity 0.75 ≥ threshold.
      expect(evaluateSpeechMatch(['Die Harz'], 'die', 'Haarwurzel')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when too little of the word was recognized', () => {
      expect(evaluateSpeechMatch(['das zun'], 'das', 'Zungenbein')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when the recognized part is not from the start of the word', () => {
      expect(evaluateSpeechMatch(['die Pyramide'], 'das', 'Zungenbein')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when the article is wrong', () => {
      expect(evaluateSpeechMatch(['Das Haar'], 'die', 'Haarwurzel')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when the noun is entirely absent', () => {
      expect(evaluateSpeechMatch(['die rechte'], 'die', 'rechte Vorkammer')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when a compound word is recognized as separate words', () => {
    it('should return correct when a compound is transcribed as its constituent parts', () => {
      // iOS Recognizer transcribes "Zwölffingerdarm" as "Zwölf Finger":
      // joining tokens → "zwoelffinger" → geminate collapse → "zwoelfinger",
      // which is a prefix of "zwoelfingerdarm" at ~78% coverage.
      expect(evaluateSpeechMatch(['der Zwölf Finger'], 'der', 'Zwölffingerdarm')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when only the first part of the compound is recognized', () => {
      // The joined-phrase prefix check rejects "derzwoelf" at 50% < 65%, but the
      // last-token prefix check accepts it: "Zwölf" is the complete first morpheme of
      // "Zwölffingerdarm" ("zwoelf" covers 6/15 = 40% of "zwoelfingerdarm" ≥ 33%).
      expect(evaluateSpeechMatch(['der Zwölf'], 'der', 'Zwölffingerdarm')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when a long compound word is recognized without a suffix', () => {
    it('should return correct when the diminutive suffix -chen is not recognized', () => {
      expect(evaluateSpeechMatch(['das Linsenknöchel'], 'das', 'Linsenknöchelchen')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when the article is missing or wrong', () => {
    it('should return incorrect when the word matches but the article is wrong', () => {
      expect(evaluateSpeechMatch(['die Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return correct when the article is missing and the word is exact', () => {
      // Speech recognizers may drop short German articles from their output
      expect(evaluateSpeechMatch(['Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when the article is missing and the word is close but not exact', () => {
      expect(evaluateSpeechMatch(['Artzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when the article is missing and word-ending phonemes are substituted', () => {
      expect(evaluateSpeechMatch(['Kleinhinz'], 'das', 'Kleinhirn')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when extra words are recognized around the correct answer', () => {
    it('should return correct when an extra word is recognized before the answer', () => {
      // The speech recognizer may start the transcript with a filler word like "Und" even when the user said only the word
      expect(evaluateSpeechMatch(['Und der Arm'], 'der', 'Arm')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when the extra word extends the recognized word', () => {
      expect(evaluateSpeechMatch(['der Armband'], 'der', 'Arm')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when the answer is embedded in a much longer transcript', () => {
      expect(evaluateSpeechMatch(['und die Bauchspeicheldrüse nicht zu nehmen'], 'die', 'Bauchspeicheldrüse')).not.toBe(
        SIMPLE_RESULTS.correct,
      )
    })
  })

  describe('when the vocabulary item is a multi-word phrase', () => {
    it('should return correct when article is dropped and word pronunciation is close', () => {
      expect(evaluateSpeechMatch(['äußere Umhündung'], 'die', 'äußere Umhüllung')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for exact multi-word match with article', () => {
      expect(evaluateSpeechMatch(['die äußere Umhüllung'], 'die', 'äußere Umhüllung')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when a completely different phrase is said', () => {
      expect(evaluateSpeechMatch(['der Arm'], 'die', 'äußere Umhüllung')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when something completely different is said', () => {
    it('should return incorrect', () => {
      expect(evaluateSpeechMatch(['Hund'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect for unrecognized speech', () => {
      expect(evaluateSpeechMatch(['[unk]'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when multiple candidates are given', () => {
    it('should return correct if any candidate is correct', () => {
      expect(evaluateSpeechMatch(['die Arzt', 'der Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect if all candidates are incorrect', () => {
      expect(evaluateSpeechMatch(['Hund', 'die Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
      expect(evaluateSpeechMatch(['Hund', 'Katze'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })
})
