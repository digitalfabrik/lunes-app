import { SIMPLE_RESULTS } from '../../../../constants/data'
import { evaluateSpeechMatch } from '../SpeechMatchingService'

describe('evaluateSpeechMatch', () => {
  describe('when transcript list is empty', () => {
    it('should return incorrect', () => {
      expect(evaluateSpeechMatch([], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when transcript matches exactly', () => {
    it('should return correct for exact match', () => {
      expect(evaluateSpeechMatch(['der Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct regardless of casing', () => {
      expect(evaluateSpeechMatch(['Der Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for exact match with umlauts', () => {
      expect(evaluateSpeechMatch(['die Ärztin'], 'die', 'Ärztin')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when transcript has normalized German characters', () => {
    it('should return correct when STT returns normalized umlaut variant', () => {
      // STT may transcribe "Ärztin" as "Aerztin"
      expect(evaluateSpeechMatch(['die Aerztin'], 'die', 'Ärztin')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when ß is transcribed as ss', () => {
      expect(evaluateSpeechMatch(['die Strasse'], 'die', 'Straße')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when Whisper drops a suffix from a long compound word', () => {
    it('should return correct when the diminutive suffix -chen is dropped', () => {
      // "Linsenknöchelchen" → "Linsenknöchel": similarity 0.818, above the 0.80 threshold
      expect(evaluateSpeechMatch(['das Linsenknöchel'], 'das', 'Linsenknöchelchen')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when transcript is phonetically close to the expected word', () => {
    it('should return correct for high similarity full phrase', () => {
      // Small typo in the word
      expect(evaluateSpeechMatch(['der Artzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when Whisper drops a geminate consonant', () => {
      // Whisper commonly transcribes "Kanne" as "Kana" (geminate nn → single n)
      expect(evaluateSpeechMatch(['Die Kana.'], 'die', 'Kanne')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when Whisper drops a geminate consonant in a longer word', () => {
      // e.g. "Kassette" → "Kasete"
      expect(evaluateSpeechMatch(['die Kasete'], 'die', 'Kassette')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when the word matches but the article is wrong or missing', () => {
    it('should return similar when the word part matches well but article is wrong', () => {
      expect(evaluateSpeechMatch(['die Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.similar)
    })

    it('should return correct when article is missing but word is exact', () => {
      // ASR models may drop short German articles from their output
      expect(evaluateSpeechMatch(['Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when article is absent and word is close but not exact', () => {
      // "Artzt" vs "Arzt": similarity 0.80 ≥ WORD_ONLY_SIMILARITY_THRESHOLD (0.75)
      expect(evaluateSpeechMatch(['Artzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when article is absent and model substitutes word-ending phonemes', () => {
      // "Kleinhirn" → "Kleinhinz": similarity ≈ 0.78 ≥ WORD_ONLY_SIMILARITY_THRESHOLD (0.75)
      expect(evaluateSpeechMatch(['Kleinhinz'], 'das', 'Kleinhirn')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when Whisper adds extra words around the correct phrase', () => {
    it('should return correct when Whisper prepends a filler word', () => {
      // Whisper commonly starts segments with "Und" even when the user just said the word
      expect(evaluateSpeechMatch(['Und der Arm.'], 'der', 'Arm')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should not match when the extra word is part of a different word', () => {
      // "Armband" should not match "Arm"
      expect(evaluateSpeechMatch(['der Armband'], 'der', 'Arm')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should not match as correct when the phrase is embedded in a longer hallucinated sentence', () => {
      // Whisper may echo the prompted word in a hallucinated sentence; the phrase
      // appearing somewhere in a much longer transcript must not count as correct.
      // (Returns similar because the word token is present, but never correct.)
      expect(evaluateSpeechMatch(['und die Bauchspeicheldrüse nicht zu nehmen'], 'die', 'Bauchspeicheldrüse')).not.toBe(
        SIMPLE_RESULTS.correct,
      )
    })
  })

  describe('when the vocabulary item is a multi-word phrase', () => {
    it('should return correct when article is dropped and word pronunciation is close', () => {
      // "die äußere Umhüllung" → Whisper heard "äußere Umhündung" (article dropped, slight error at end)
      // similarity("aeusere umhuendung", "aeusere umhuelung") ≈ 0.89 ≥ WORD_ONLY_SIMILARITY_THRESHOLD
      expect(evaluateSpeechMatch(['äußere Umhündung'], 'die', 'äußere Umhüllung')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for exact multi-word match with article', () => {
      expect(evaluateSpeechMatch(['die äußere Umhüllung'], 'die', 'äußere Umhüllung')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when a completely different phrase is said', () => {
      expect(evaluateSpeechMatch(['der Arm'], 'die', 'äußere Umhüllung')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when transcript is completely different', () => {
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

    it('should return similar if no correct candidate but one is similar', () => {
      // "die Arzt" has the wrong article → similar; "Hund" is incorrect; best result is similar
      expect(evaluateSpeechMatch(['Hund', 'die Arzt'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.similar)
    })

    it('should return incorrect if all candidates are incorrect', () => {
      expect(evaluateSpeechMatch(['Hund', 'Katze'], 'der', 'Arzt')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })
})
