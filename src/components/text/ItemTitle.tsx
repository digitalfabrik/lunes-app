import styled from 'styled-components/native'

const ItemTitle = styled.Text<{ selected: boolean }>`
  text-align: left;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  color: ${prop => (prop.selected ? prop.theme.colors.background : prop.theme.colors.text)};
`
export default ItemTitle
