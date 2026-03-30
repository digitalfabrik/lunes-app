import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect } from 'react'
import { Image, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ArrowLeftIcon, ArrowRightIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ExerciseHeader from '../../components/ExerciseHeader'
import HorizontalLine from '../../components/HorizontalLine'
import RouteWrapper from '../../components/RouteWrapper'
import VocabularyDetail from '../../components/VocabularyDetail'
import { BUTTONS_THEME } from '../../constants/data'
import { VocabularyItemTypes } from '../../models/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import AlternativeWordsSection from './components/AlternativeWordsSection'

const Container = styled.View`
  width: 85%;
  align-self: center;
  text-align: left;
`

const ButtonContainer = styled.View`
  padding: ${props => props.theme.spacings.md};
  align-self: center;
`

type VocabularyDetailExerciseScreenProps = {
  route: RouteProp<RoutesParams, 'VocabularyDetailExercise'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyDetailExercise'>
}

const VocabularyDetailExerciseScreen = ({ route, navigation }: VocabularyDetailExerciseScreenProps): ReactElement => {
  const { vocabularyItems, vocabularyItemIndex } = route.params
  const vocabularyItem = vocabularyItems[vocabularyItemIndex]
  const hasNextVocabularyItem = vocabularyItemIndex + 1 < vocabularyItems.length
  const hasPreviousVocabularyItem = vocabularyItemIndex > 0
  const closeExerciseLabel = getLabels().results.action.backToWordlist

  useEffect(() => {
    if (hasNextVocabularyItem) {
      const images = vocabularyItems[vocabularyItemIndex + 1].images
      if (images.length > 0) {
        Image.prefetch(images[0]).catch(reportError)
      }
    }
  }, [vocabularyItemIndex, vocabularyItems, hasNextVocabularyItem])

  const goToNextWord = () =>
    navigation.navigate('VocabularyDetailExercise', { ...route.params, vocabularyItemIndex: vocabularyItemIndex + 1 })
  const goToPreviousWord = () =>
    navigation.navigate('VocabularyDetailExercise', { ...route.params, vocabularyItemIndex: vocabularyItemIndex - 1 })

  return (
    <RouteWrapper shouldSetBottomInset>
      <ExerciseHeader
        navigation={navigation}
        currentWord={vocabularyItemIndex}
        numberOfWords={vocabularyItems.length}
        confirmClose={false}
        feedbackTarget={
          vocabularyItem.id.type === VocabularyItemTypes.Standard
            ? { type: 'word', wordId: vocabularyItem.id }
            : undefined
        }
      />
      <ScrollView>
        <VocabularyDetail vocabularyItem={vocabularyItem} />
        <Container>
          <HorizontalLine />

          <AlternativeWordsSection vocabularyItem={vocabularyItem} />

          <ButtonContainer>
            {hasNextVocabularyItem ? (
              <Button
                label={getLabels().exercises.next}
                iconRight={ArrowRightIcon}
                onPress={goToNextWord}
                buttonTheme={BUTTONS_THEME.contained}
              />
            ) : (
              <Button label={closeExerciseLabel} onPress={navigation.goBack} buttonTheme={BUTTONS_THEME.contained} />
            )}
            {hasPreviousVocabularyItem && (
              <Button
                label={getLabels().exercises.previous}
                iconLeft={ArrowLeftIcon}
                onPress={goToPreviousWord}
                buttonTheme={BUTTONS_THEME.text}
              />
            )}
          </ButtonContainer>
        </Container>
      </ScrollView>
    </RouteWrapper>
  )
}

export default VocabularyDetailExerciseScreen
