import { hyphenate } from '../hyphenation'

const SOFT_HYPHEN = '­'

describe('hyphenate', () => {
  describe('when a word is long enough to need hyphenation', () => {
    it.each([
      ['Anschlussdatenbezeichnung', ['An', 'schluss', 'da', 'ten', 'be', 'zeich', 'nung']],
      ['Schutzleiteranschluss', ['Schutz', 'lei', 'ter', 'an', 'schluss']],
      ['Verbindungsklemme', ['Ver', 'bin', 'dungs', 'klem', 'me']],
      ['Straßenbahnhaltestelle', ['Stra', 'ßen', 'bahn', 'hal', 'te', 'stel', 'le']],
    ])('should break %s at its German syllable boundaries', (word, syllables) => {
      expect(hyphenate(word)).toBe(syllables.join(SOFT_HYPHEN))
    })
  })

  describe('when every word is short enough to fit on one line', () => {
    it.each(['Spachtel', 'Alternative', 'Anschlüsse & Signale', ''])('should return %p unchanged', text => {
      expect(hyphenate(text)).toBe(text)
    })
  })

  describe('when the text mixes long and short words', () => {
    it('should only hyphenate the long ones', () => {
      expect(hyphenate('die Verbindungsklemme')).toBe(`die ${['Ver', 'bin', 'dungs', 'klem', 'me'].join(SOFT_HYPHEN)}`)
    })
  })
})
