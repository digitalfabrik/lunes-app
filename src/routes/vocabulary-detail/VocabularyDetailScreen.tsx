import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ExerciseHeader from '../../components/ExerciseHeader'
import FeedbackModal from '../../components/FeedbackModal'
import HorizontalLine from '../../components/HorizontalLine'
import VocabularyDetail from '../../components/VocabularyDetail'
import { BUTTONS_THEME, FeedbackType } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import AlternativeWordsSection from './components/AlternativeWordsSection'

const Container = styled.View`
  width: 85%;
  align-self: center;
  text-align: left;
`

const ButtonContainer = styled.View`
  padding: ${props => props.theme.spacings.md}
  align-self: center;
`

interface VocabularyDetailScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyDetail'>
}

const VocabularyDetailScreen = ({ route, navigation }: VocabularyDetailScreenProps): ReactElement => {
  const { documents, documentIndex, closeExerciseAction, labelOverrides } = route.params // TODO: routin
  const document = documents[documentIndex]
  const hasNextDocument = documentIndex + 1 < documents.length
  const closeExerciseLabel = labelOverrides?.closeExerciseButtonLabel ?? getLabels().results.action.backToWordlist
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)

  const goToNextWord = () =>
    navigation.navigate('VocabularyDetail', { ...route.params, documentIndex: documentIndex + 1 })

  return (
    <SafeAreaView>
      <ExerciseHeader
        navigation={navigation}
        currentWord={documentIndex}
        numberOfWords={documents.length}
        confirmClose={false}
        closeExerciseAction={closeExerciseAction}
        feedbackType={FeedbackType.vocabularyItem}
        feedbackForId={document.id}
        labelOverride={labelOverrides?.closeExerciseHeaderLabel}
        isCloseButton={labelOverrides?.isCloseButton}
      />
      <VocabularyDetail vocabularyItem={document} />
      <Container>
        <HorizontalLine />

        <AlternativeWordsSection vocabularyItem={document} />

        <ButtonContainer>
          {hasNextDocument ? (
            <Button
              label={getLabels().exercises.next}
              iconRight={ArrowRightIcon}
              onPress={goToNextWord}
              buttonTheme={BUTTONS_THEME.contained}
            />
          ) : (
            <Button label={closeExerciseLabel} onPress={navigation.goBack} buttonTheme={BUTTONS_THEME.contained} />
          )}
        </ButtonContainer>
      </Container>
      <FeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
        feedbackType={FeedbackType.vocabularyItem}
        feedbackForId={document.id}
      />
    </SafeAreaView>
  )
}

export default VocabularyDetailScreen
