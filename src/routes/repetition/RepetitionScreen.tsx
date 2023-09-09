import React, { ReactElement, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { InfoCircleBlackIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ModalSkeleton from '../../components/ModalSkeleton'
import RouteWrapper from '../../components/RouteWrapper'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import theme from '../../constants/theme'
import { getLabels } from '../../services/helpers'
import RepetitionProgressChart from './components/RepetitionProgressChart'

const Root = styled.ScrollView`
  padding: 0 ${props => props.theme.spacings.sm};
  height: 100%;
`
const StyledHeading = styled(HeadingText)`
  text-align: center;
  margin-top: ${props => props.theme.spacings.xl};
  margin-bottom: ${props => props.theme.spacings.lg};
`
const TextContainer = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-size: ${hp('1.8%')}px;
`
const Container = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.disabled};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${props => props.theme.spacings.sm} 0;
  padding: ${props => props.theme.spacings.sm} 0;
`
const Subheading = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  padding-right: ${props => props.theme.spacings.xs};
`
const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: row;
  position: relative;
`
const IconWrapper = styled.View`
  position: absolute;
  left: ${hp('18%')}px;
  top: ${hp('0.2%')}px; ;
`
const ModalContainer = styled.View`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${hp('24%')}px;
`

const RepetitionScreen = (): ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const { repeatWords, repeatNow, wordsToRepeat, yourLearningProgress } = getLabels().repetition

  return (
    <RouteWrapper>
      <Root>
        <StyledHeading>{repeatWords}</StyledHeading>
        <Container>
          <TextContainer>{wordsToRepeat}</TextContainer>
          <Button onPress={() => setIsModalVisible(true)} label={repeatNow} buttonTheme={BUTTONS_THEME.contained} />
        </Container>
        <Container>
          <HeaderWrapper>
            <Subheading>{yourLearningProgress}</Subheading>
            <IconWrapper>
              <InfoCircleBlackIcon
                testID='info-circle-black-icon'
                width={theme.spacingsPlain.sm}
                height={theme.spacingsPlain.sm}
                onPress={() => setIsModalVisible(true)}
              />
            </IconWrapper>
          </HeaderWrapper>
          <RepetitionProgressChart />
        </Container>
        {isModalVisible && (
          <ModalSkeleton visible={isModalVisible} onClose={() => setIsModalVisible(false)} testID='info-modal'>
            <ModalContainer />
          </ModalSkeleton>
        )}
      </Root>
    </RouteWrapper>
  )
}
export default RepetitionScreen
