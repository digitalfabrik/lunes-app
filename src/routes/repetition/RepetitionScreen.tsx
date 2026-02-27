import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ArrowRightIcon, InfoCircleBlackIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ModalSkeleton from '../../components/ModalSkeleton'
import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary, ContentTextBold } from '../../components/text/Content'
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

const HeadingContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacings.xl};
  margin-bottom: ${props => props.theme.spacings.lg};
  gap: ${props => props.theme.spacings.xs};
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
`

const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
`

const ModalContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  height: ${hp('16%')}px;
`

const ModalContent = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs};
`

const PressableText = styled.Pressable`
  flex-direction: row;
  gap: ${theme => theme.theme.spacings.xs};
`

type RepetitionScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Repetition'>
}

const RepetitionScreen = ({ navigation }: RepetitionScreenProps): ReactElement => {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false)
  const [isProgressExplainerVisible, setIsProgressExplainerVisible] = useState<boolean>(false)
  const {
    infoModalContent,
    repeatWords,
    repeatNow,
    wordsToRepeat,
    yourLearningProgress,
    progressExplainerContent,
    viewWords,
  } = getLabels().repetition
  const repetitionService = useRepetitionService()
  const numberOfWordsNeedingRepetition = repetitionService.getNumberOfWordsNeedingRepetition()

  const navigate = async () => {
    const wordNodeCards = repetitionService.getWordNodeCardsForNextRepetition()
    if (wordNodeCards.length > 0) {
      navigation.navigate('WordChoiceExercise', {
        unitId: null,
        vocabularyItems: wordNodeCards.map(item => ({ ...item.word })),
        contentType: 'repetition',
        unitTitle: '',
      })
    }
  }

  return (
    <RouteWrapper>
      <Root>
        <HeadingContainer>
          <HeadingText>{repeatWords}</HeadingText>
          <InfoCircleBlackIcon
            testID='repetition-info-icon'
            width={theme.spacingsPlain.sm}
            height={theme.spacingsPlain.sm}
            onPress={() => setIsInfoModalVisible(true)}
          />
        </HeadingContainer>
        <Container>
          <TextContainer>{`${numberOfWordsNeedingRepetition} ${pluralize(wordsToRepeat, numberOfWordsNeedingRepetition)}`}</TextContainer>
          <Button
            testID='repetition-button'
            onPress={navigate}
            label={repeatNow}
            buttonTheme={BUTTONS_THEME.contained}
            disabled={numberOfWordsNeedingRepetition === 0}
          />
          {numberOfWordsNeedingRepetition > 0 && (
            <PressableText onPress={() => navigation.navigate('RepetitionWordList')}>
              <ContentTextBold>{viewWords}</ContentTextBold>
              <ArrowRightIcon />
            </PressableText>
          )}
        </Container>
        <Container>
          <HeaderWrapper>
            <Subheading>{yourLearningProgress}</Subheading>
            <InfoCircleBlackIcon
              testID='progress-info-icon'
              width={theme.spacingsPlain.sm}
              height={theme.spacingsPlain.sm}
              onPress={() => setIsProgressExplainerVisible(true)}
            />
          </HeaderWrapper>
          <RepetitionProgressChart />
        </Container>
        <ModalSkeleton visible={isInfoModalVisible} onClose={() => setIsInfoModalVisible(false)} testID='infoModal'>
          <ModalContainer>
            <ModalContent>{infoModalContent}</ModalContent>
          </ModalContainer>
        </ModalSkeleton>
        <ModalSkeleton
          visible={isProgressExplainerVisible}
          onClose={() => setIsProgressExplainerVisible(false)}
          testID='progressModal'
        >
          <ModalContainer>
            <ModalContent>{progressExplainerContent}</ModalContent>
          </ModalContainer>
        </ModalSkeleton>
      </Root>
    </RouteWrapper>
  )
}
export default RepetitionScreen
