import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

const RoundedBackground = styled.View<{ color?: string; height?: string }>`
  width: 140%;
  height: ${props => props.height};
  background-color: ${props => props.color ?? props.theme.colors.primary};
  border-bottom-left-radius: ${hp('60%')}px;
  border-bottom-right-radius: ${hp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.xxl};
  justify-content: center;
  align-items: center;
  text-align: center;
`

export default RoundedBackground
