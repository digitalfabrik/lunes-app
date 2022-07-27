import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../assets/images'
import Button from '../components/Button'
import DocumentImageSection from '../components/DocumentImageSection'
import ExerciseHeader from '../components/ExerciseHeader'
import WordItem from '../components/WordItem'
import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import RouteWrapper from '../components/RouteWrapper'

const ItemContainer = styled.View`
  margin: ${props => props.theme.spacings.xl} 0;
  height: 10%;
  width: 85%;
  align-self: center;
`

const ButtonContainer = styled.View`
  display: flex;
  align-self: center;
`

interface VocabularyDetailScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyDetail'>
}

const VocabularyDetailScreen = ({ route, navigation }: VocabularyDetailScreenProps): ReactElement => {
  const { documents, documentIndex, closeExerciseAction } = route.params
  const document = documents[documentIndex]
  const { word, article } = document
  const hasNextDocument = documentIndex + 1 < documents.length

  const goToNextWord = () =>
    navigation.navigate('VocabularyDetail', { ...route.params, documentIndex: documentIndex + 1 })

  return (
    <RouteWrapper>
      <ExerciseHeader
        navigation={navigation}
        currentWord={documentIndex}
        numberOfWords={documents.length}
        confirmClose={false}
        closeExerciseAction={closeExerciseAction}
      />
      <DocumentImageSection document={document} />
      <ItemContainer>
        <WordItem answer={{ word, article }} />
      </ItemContainer>
      <ButtonContainer>
        {hasNextDocument ? (
          <Button
            label={labels.exercises.next}
            iconRight={ArrowRightIcon}
            onPress={goToNextWord}
            buttonTheme={BUTTONS_THEME.contained}
          />
        ) : (
          <Button
            label={labels.general.header.cancelExercise}
            onPress={navigation.goBack}
            buttonTheme={BUTTONS_THEME.contained}
          />
        )}
      </ButtonContainer>
    </RouteWrapper>
  )
}

export default VocabularyDetailScreen
