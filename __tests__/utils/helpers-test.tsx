import {getArticleColor} from '../../utils/helpers';
import {COLORS} from '../../constants/colors';

describe('Utils: getArticleColor tests', () => {
  test('der test', () =>
    expect(getArticleColor('der')).toBe(COLORS.lunesArtikelDer));
  test('die test', () =>
    expect(getArticleColor('die')).toBe(COLORS.lunesArtikelDie));
  test('das test', () =>
    expect(getArticleColor('das')).toBe(COLORS.lunesArtikelDas));
  test('die (plural) test', () =>
    expect(getArticleColor('die (plural)')).toBe(COLORS.lunesArtikelDiePlural));
  test('default test', () =>
    expect(getArticleColor('default')).toBe(COLORS.lunesArtikelDer));
});
