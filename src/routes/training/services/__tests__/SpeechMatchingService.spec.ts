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

  describe('when the VAD cuts off speech mid-word', () => {
    it('should return correct when the transcript is a prefix covering ≥ 65% of the expected phrase', () => {
      // Android VAD on emulators may stop recognition before the final syllables of a long
      // compound word (e.g. "das zungenb" instead of "das Zungenbein", ~79% coverage).
      expect(evaluateSpeechMatch(['das zungenb'], 'das', 'Zungenbein')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for a French-origin suffix that the recognizer consistently drops', () => {
      // "Seitenbronchien" → "die seitenbron": ~74% coverage, above the 65% threshold.
      // The "-chien" ending is phonetically unusual and emulator ASR drops it reliably.
      expect(evaluateSpeechMatch(['die seitenbron'], 'die', 'Seitenbronchien')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when only a partial root is recognised (≥ 65% coverage)', () => {
      // "Unterlappen" → "der unterl": 10/14 chars ≈ 71% of the normalised phrase.
      expect(evaluateSpeechMatch(['der unterl'], 'der', 'Unterlappen')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when iOS truncates at a morpheme boundary (65–70% coverage)', () => {
      // iOS SFSpeechRecognizer reliably truncates "Fingerglied" at the first morpheme:
      // "das Fingerglied" → "Das Finger": 10/15 chars = 66.7%, above the 65% threshold.
      expect(evaluateSpeechMatch(['Das Finger'], 'das', 'Fingerglied')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when the prefix is too short (< 65% coverage)', () => {
      expect(evaluateSpeechMatch(['das zun'], 'das', 'Zungenbein')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should not match a different word that happens to have the same coverage', () => {
      // "die Pyramide" is not a prefix of "das Zungenbein"
      expect(evaluateSpeechMatch(['die Pyramide'], 'das', 'Zungenbein')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when iOS truncates at a morpheme boundary within the last token', () => {
    it('should return correct when the last token is the first morpheme of the compound', () => {
      // iOS gives "Die Haar" for "die Haarwurzel": article matches, token count matches,
      // last token "har" covers 3/9 = 33% of "harwurzel" ≥ LAST_TOKEN_PREFIX_THRESHOLD.
      expect(evaluateSpeechMatch(['Die Haar'], 'die', 'Haarwurzel')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when the last token is a fuzzy-close prefix of the expected last token', () => {
      // iOS sometimes returns near-misses like "Die Harz" for "die Haarwurzel":
      // "harz" vs "harw" (first 4 chars of "harwurzel") has similarity 0.75 ≥ threshold.
      expect(evaluateSpeechMatch(['Die Harz'], 'die', 'Haarwurzel')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when the article is wrong', () => {
      // Preceding tokens must match exactly, so wrong article → rejected.
      expect(evaluateSpeechMatch(['Das Haar'], 'die', 'Haarwurzel')).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when the noun is entirely absent', () => {
      // "die rechte" for "die rechte Vorkammer": 2 vs 3 tokens → token count guard fires.
      expect(evaluateSpeechMatch(['die rechte'], 'die', 'rechte Vorkammer')).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when iOS splits a compound word into space-separated morphemes', () => {
    it('should return correct when a compound is transcribed as its constituent parts', () => {
      // iOS SFSpeechRecognizer transcribes "Zwölffingerdarm" as "Zwölf Finger":
      // joining tokens → "zwoelffinger" → geminate collapse → "zwoelfinger",
      // which is a prefix of "zwoelfingerdarm" at ~78% coverage.
      expect(evaluateSpeechMatch(['der Zwölf Finger'], 'der', 'Zwölffingerdarm')).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when the first morpheme alone is recognised', () => {
      // The joined-phrase prefix check rejects "derzwoelf" at 50% < 65%, but the
      // token-level check accepts it: "Zwölf" is the complete first morpheme of
      // "Zwölffingerdarm" ("zwoelf" covers 6/15 = 40% of "zwoelfingerdarm" ≥ 33%).
      expect(evaluateSpeechMatch(['der Zwölf'], 'der', 'Zwölffingerdarm')).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when ASR mishears a German silent-h or th digraph', () => {
    it('should return correct when ASR returns "steht" for "Stethoskop"', () => {
      // German "th" (Greek loanword) is pronounced as "t": "Stethoskop" → "stetoskop".
      // German vowel-lengthening "h" is silent: "steht" → "stet".
      // After both normalizations "stet" is a prefix of "stetoskop" at 4/9 = 44% ≥ 33%.
      expect(evaluateSpeechMatch(['Das steht'], 'das', 'Stethoskop')).toBe(SIMPLE_RESULTS.correct)
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
