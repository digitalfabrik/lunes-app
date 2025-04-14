import { CommonActions } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useMemo, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { InfoCircleBlackIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ModalSkeleton from '../../components/ModalSkeleton'
import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import theme from '../../constants/theme'
import useRepetitionService from '../../hooks/useRepetitionService'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, pluralize } from '../../services/helpers'
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
  top: ${hp('0.2%')}px;
`
const ModalContainer = styled.View`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${hp('24%')}px;
`
const ModalContent = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs};
`

type RepetitionScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Repetition'>
}
const RepetitionScreen = ({ navigation }: RepetitionScreenProps): ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const { repeatWords, repeatNow, wordsToRepeat, yourLearningProgress, infoModalContentText } = getLabels().repetition
  const repetitionService = useRepetitionService()
  const numberOfWordsNeedingRepetition = useMemo(
    () => repetitionService.getNumberOfWordsNeedingRepetition(),
    [repetitionService],
  )

  const navigate = async () => {
    const closeExerciseAction = CommonActions.navigate('Repetition')
    const wordNodeCards = repetitionService.getWordNodeCardsForNextRepetition()
    if (wordNodeCards.length > 0) {
      navigation.navigate('WriteExercise', {
        vocabularyItems: wordNodeCards.map(item => ({ ...item.word })),
        contentType: 'repetition',
        disciplineTitle: '',
        closeExerciseAction,
      })
    }
  }

  return (
    <RouteWrapper>
      <Root>
        <StyledHeading>{repeatWords}</StyledHeading>
        <Container>
          <TextContainer>{`${numberOfWordsNeedingRepetition} ${pluralize(wordsToRepeat, numberOfWordsNeedingRepetition)}`}</TextContainer>
          <Button
            testID='repetition-button'
            onPress={navigate}
            label={repeatNow}
            buttonTheme={BUTTONS_THEME.contained}
            disabled={numberOfWordsNeedingRepetition === 0}
          />
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
        <ModalSkeleton visible={isModalVisible} onClose={() => setIsModalVisible(false)} testID='infoModal'>
          <ModalContainer>
            <ModalContent>{infoModalContentText}</ModalContent>
          </ModalContainer>
        </ModalSkeleton>
      </Root>
    </RouteWrapper>
  )
}
export default RepetitionScreen
