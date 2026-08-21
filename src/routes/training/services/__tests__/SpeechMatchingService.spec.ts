import { ARTICLES, SIMPLE_RESULTS } from '../../../../constants/data'
import { evaluateSpeechMatch, SPEECH_FEEDBACK_REASONS } from '../SpeechMatchingService'

const NO_ARTICLE = ARTICLES[0]
const DER = ARTICLES[1]
const DIE = ARTICLES[2]
const DAS = ARTICLES[3]
const DIE_PLURAL = ARTICLES[4]

describe('evaluateSpeechMatch', () => {
  describe('when transcript list is empty', () => {
    it('should return incorrect', () => {
      expect(evaluateSpeechMatch([], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when the correct phrase is said exactly', () => {
    it('should return correct for exact match', () => {
      expect(evaluateSpeechMatch(['der Arzt'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct regardless of casing', () => {
      expect(evaluateSpeechMatch(['Der Arzt'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for exact match with umlauts', () => {
      expect(evaluateSpeechMatch(['die Ärztin'], DIE, 'Ärztin').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when German special characters are transcribed differently', () => {
      expect(evaluateSpeechMatch(['die Aerztin'], DIE, 'Ärztin').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when ß is transcribed as ss', () => {
      expect(evaluateSpeechMatch(['die Strasse'], DIE, 'Straße').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when an accent is dropped from a loanword', () => {
      // "das Café" and "das Cafe" have to count as the same three syllables
      expect(evaluateSpeechMatch(['das Cafe'], DAS, 'Café').result).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when the pronunciation is close but not exact', () => {
    it('should return correct for a near-miss of the full phrase', () => {
      expect(evaluateSpeechMatch(['der Artzt'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when a geminate consonant is dropped', () => {
      // Speech recognizers commonly transcribe "Kanne" as "Kana" (geminate nn → single n)
      expect(evaluateSpeechMatch(['Die Kana'], DIE, 'Kanne').result).toBe(SIMPLE_RESULTS.correct)
      expect(evaluateSpeechMatch(['die Kasete'], DIE, 'Kassette').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when word-ending phonemes are substituted', () => {
      // All three syllables are there, only the ending is misheard: similarity 0.846
      expect(evaluateSpeechMatch(['das Kleinhinz'], DAS, 'Kleinhirn').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when silent letters cause a transcription mismatch', () => {
      // German "th" (Greek loanword) is pronounced as "t": "Stethoskop" → "stetoskop".
      // German vowel-lengthening "h" is silent: "Zähne" → "zaene".
      expect(evaluateSpeechMatch(['das Stetoskop'], DAS, 'Stethoskop').result).toBe(SIMPLE_RESULTS.correct)
      expect(evaluateSpeechMatch(['die Zäne'], DIE_PLURAL, 'Zähne').result).toBe(SIMPLE_RESULTS.correct)
    })
  })

  describe('when a syllable is missing', () => {
    it('should return incorrect when a leading syllable is swallowed', () => {
      // "die bodenheizung" vs "die fusbodenheizung" scores 0.842, well above the 0.8 threshold
      const match = evaluateSpeechMatch(['die Bodenheizung'], DIE, 'Fußbodenheizung')

      expect(match.result).toBe(SIMPLE_RESULTS.incorrect)
      expect(match.reason).toBe(SPEECH_FEEDBACK_REASONS.incompleteWord)
    })

    it('should return incorrect when an inner syllable is swallowed', () => {
      // Two edits from the expected phrase, the same distance as the legitimate "das Kleinhinz"
      const match = evaluateSpeechMatch(['das Waschmachienventil'], DAS, 'Waschmaschinenventil')

      expect(match.result).toBe(SIMPLE_RESULTS.incorrect)
      expect(match.reason).toBe(SPEECH_FEEDBACK_REASONS.incompleteWord)
    })

    it('should return correct when the whole compound is pronounced', () => {
      expect(evaluateSpeechMatch(['die Fußbodenheizung'], DIE, 'Fußbodenheizung').result).toBe(SIMPLE_RESULTS.correct)
      expect(evaluateSpeechMatch(['das Waschmaschinenventil'], DAS, 'Waschmaschinenventil').result).toBe(
        SIMPLE_RESULTS.correct,
      )
    })

    it('should return incorrect when a whole word of a phrase is missing', () => {
      expect(evaluateSpeechMatch(['die Umhüllung'], DIE, 'äußere Umhüllung').result).toBe(SIMPLE_RESULTS.incorrect)
      expect(evaluateSpeechMatch(['die rechte'], DIE, 'rechte Vorkammer').result).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when the word is cut off before the end', () => {
    // Voice activity detection can stop before the final syllables of a long compound, but a truncated
    // word is what the exercise must not accept, so these count as incomplete too (issue 1456).
    it('should return incorrect when the last syllables are missing', () => {
      const match = evaluateSpeechMatch(['das zungenb'], DAS, 'Zungenbein')

      expect(match.result).toBe(SIMPLE_RESULTS.incorrect)
      expect(match.reason).toBe(SPEECH_FEEDBACK_REASONS.incompleteWord)
    })

    it('should return incorrect when recognition stops at a morpheme boundary', () => {
      expect(evaluateSpeechMatch(['Das Finger'], DAS, 'Fingerglied').result).toBe(SIMPLE_RESULTS.incorrect)
      expect(evaluateSpeechMatch(['Die Haar'], DIE, 'Haarwurzel').result).toBe(SIMPLE_RESULTS.incorrect)
      expect(evaluateSpeechMatch(['der Zwölf'], DER, 'Zwölffingerdarm').result).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when a suffix is missing', () => {
      expect(evaluateSpeechMatch(['die seitenbron'], DIE, 'Seitenbronchien').result).toBe(SIMPLE_RESULTS.incorrect)
      expect(evaluateSpeechMatch(['das Linsenknöchel'], DAS, 'Linsenknöchelchen').result).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when only a partial root is recognized', () => {
      expect(evaluateSpeechMatch(['der unterl'], DER, 'Unterlappen').result).toBe(SIMPLE_RESULTS.incorrect)
      expect(evaluateSpeechMatch(['das zun'], DAS, 'Zungenbein').result).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when the recognized part is not from the start of the word', () => {
      expect(evaluateSpeechMatch(['die Pyramide'], DAS, 'Zungenbein').result).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when a compound word is recognized as separate words', () => {
    it('should return correct when the recognizer splits the compound into tokens', () => {
      // iOS transcribes "Zwölffingerdarm" as separate words; joining the tokens recovers it
      expect(evaluateSpeechMatch(['der Zwölffinger Darm'], DER, 'Zwölffingerdarm').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when a part of the split compound is missing', () => {
      expect(evaluateSpeechMatch(['der Zwölf Finger'], DER, 'Zwölffingerdarm').result).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when the article is missing or wrong', () => {
    it('should return incorrect when the article is missing', () => {
      const match = evaluateSpeechMatch(['Arzt'], DER, 'Arzt')

      expect(match.result).toBe(SIMPLE_RESULTS.incorrect)
      expect(match.reason).toBe(SPEECH_FEEDBACK_REASONS.missingArticle)
    })

    it('should return incorrect when the article is missing and the word is close but not exact', () => {
      expect(evaluateSpeechMatch(['Artzt'], DER, 'Arzt').reason).toBe(SPEECH_FEEDBACK_REASONS.missingArticle)
      expect(evaluateSpeechMatch(['äußere Umhündung'], DIE, 'äußere Umhüllung').reason).toBe(
        SPEECH_FEEDBACK_REASONS.missingArticle,
      )
    })

    it('should return incorrect when the article is wrong', () => {
      const match = evaluateSpeechMatch(['die Arzt'], DER, 'Arzt')

      expect(match.result).toBe(SIMPLE_RESULTS.incorrect)
      expect(match.reason).toBe(SPEECH_FEEDBACK_REASONS.wrongArticle)
    })

    it('should return incorrect when the article is wrong on a long word', () => {
      // The article is a small part of a long phrase, so the similarity alone would not notice it
      expect(evaluateSpeechMatch(['der Bauchspeicheldrüse'], DIE, 'Bauchspeicheldrüse').reason).toBe(
        SPEECH_FEEDBACK_REASONS.wrongArticle,
      )
    })

    it('should not blame the article when something entirely different was said', () => {
      expect(evaluateSpeechMatch(['Hund'], DER, 'Arzt').reason).toBeUndefined()
      expect(evaluateSpeechMatch(['Das Haar'], DIE, 'Haarwurzel').reason).toBeUndefined()
    })
  })

  describe('when a loanword is spelled with an accent', () => {
    it('should return correct whichever side carries the accent', () => {
      // The recognizer spells loanwords both ways, so the accent must fold to its base letter rather
      // than being dropped, which would cost the word a syllable
      expect(evaluateSpeechMatch(['das Cafe'], DAS, 'Café').result).toBe(SIMPLE_RESULTS.correct)
      expect(evaluateSpeechMatch(['das Café'], DAS, 'Cafe').result).toBe(SIMPLE_RESULTS.correct)
      expect(evaluateSpeechMatch(['das Soufflee'], DAS, 'Soufflé').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for an accented near-miss', () => {
      expect(evaluateSpeechMatch(['das Kafé'], DAS, 'Café').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct without an article for an item that has none', () => {
      expect(evaluateSpeechMatch(['Cafe'], NO_ARTICLE, 'Café').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should still return incorrect when a syllable is missing', () => {
      expect(evaluateSpeechMatch(['das Caf'], DAS, 'Café').reason).toBe(SPEECH_FEEDBACK_REASONS.incompleteWord)
    })
  })

  describe('when the vocabulary item has no article', () => {
    it('should return correct for the word alone', () => {
      expect(evaluateSpeechMatch(['Deutschland'], NO_ARTICLE, 'Deutschland').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct for a near-miss of the word alone', () => {
      expect(evaluateSpeechMatch(['Deutschlant'], NO_ARTICLE, 'Deutschland').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should not expect the literal article value "keiner" to be spoken', () => {
      // Grading against "keiner Deutschland" would make the item unpassable, so the word alone counts
      expect(evaluateSpeechMatch(['Deutschland'], NO_ARTICLE, 'Deutschland').reason).toBeUndefined()
      expect(evaluateSpeechMatch(['die Deutschland'], NO_ARTICLE, 'Deutschland').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when a syllable is missing', () => {
      expect(evaluateSpeechMatch(['Bodenheizung'], NO_ARTICLE, 'Fußbodenheizung').result).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when the vocabulary item is plural', () => {
    it('should accept the plural article', () => {
      expect(evaluateSpeechMatch(['die Zähne'], DIE_PLURAL, 'Zähne').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when the plural article is missing', () => {
      expect(evaluateSpeechMatch(['Zähne'], DIE_PLURAL, 'Zähne').reason).toBe(SPEECH_FEEDBACK_REASONS.missingArticle)
    })
  })

  describe('when extra words are recognized around the correct answer', () => {
    it('should return correct when an extra word is recognized before the answer', () => {
      // The speech recognizer may start the transcript with a filler word like "Und" even when the user said only the word
      expect(evaluateSpeechMatch(['Und der Arm'], DER, 'Arm').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when the extra word extends the recognized word', () => {
      expect(evaluateSpeechMatch(['der Armband'], DER, 'Arm').result).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect when the answer is embedded in a much longer transcript', () => {
      expect(
        evaluateSpeechMatch(['und die Bauchspeicheldrüse nicht zu nehmen'], DIE, 'Bauchspeicheldrüse').result,
      ).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when the vocabulary item is a multi-word phrase', () => {
    it('should return correct for exact multi-word match with article', () => {
      expect(evaluateSpeechMatch(['die äußere Umhüllung'], DIE, 'äußere Umhüllung').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return correct when the pronunciation of a multi-word phrase is close', () => {
      expect(evaluateSpeechMatch(['die äußere Umhündung'], DIE, 'äußere Umhüllung').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect when a completely different phrase is said', () => {
      expect(evaluateSpeechMatch(['der Arm'], DIE, 'äußere Umhüllung').result).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when something completely different is said', () => {
    it('should return incorrect', () => {
      expect(evaluateSpeechMatch(['Hund'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should return incorrect for unrecognized speech', () => {
      expect(evaluateSpeechMatch(['[unk]'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.incorrect)
    })
  })

  describe('when multiple candidates are given', () => {
    it('should return correct if any candidate is correct', () => {
      expect(evaluateSpeechMatch(['die Arzt', 'der Arzt'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.correct)
    })

    it('should return incorrect if all candidates are incorrect', () => {
      expect(evaluateSpeechMatch(['Hund', 'die Arzt'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.incorrect)
      expect(evaluateSpeechMatch(['Hund', 'Katze'], DER, 'Arzt').result).toBe(SIMPLE_RESULTS.incorrect)
    })

    it('should take the hint from the most confident candidate', () => {
      expect(evaluateSpeechMatch(['Arzt', 'Katze'], DER, 'Arzt').reason).toBe(SPEECH_FEEDBACK_REASONS.missingArticle)
    })

    it('should not take a hint from a less confident candidate', () => {
      // "der Alarm" shows the article was spoken, so a missingArticle hint from the alternate would
      // coach the learner to fix something they got right
      expect(evaluateSpeechMatch(['der Alarm', 'Arm'], DER, 'Arm').reason).toBeUndefined()
    })
  })
})
