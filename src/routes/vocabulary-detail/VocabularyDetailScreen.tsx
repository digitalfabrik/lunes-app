import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../assets/images'
import Button from '../../components/Button'
import DocumentImageSection from '../../components/DocumentImageSection'
import ExerciseHeader from '../../components/ExerciseHeader'
import HorizontalLine from '../../components/HorizontalLine'
import WordItem from '../../components/WordItem'
import { BUTTONS_THEME } from '../../constants/data'
import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AlternativeWordsSection from './components/AlternativeWordsSection'

const CorrectInfoBox = styled.View`
  margin: ${props => props.theme.spacings.md} 0 ${props => props.theme.spacings.sm};
  width: 100%;
`

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
  const { documents, documentIndex, closeExerciseAction } = route.params
  const document = documents[documentIndex]
  const { word, article } = document
  const hasNextDocument = documentIndex + 1 < documents.length

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
      />
      <DocumentImageSection document={document} />
      <Container>
        <CorrectInfoBox>
          <WordItem answer={{ word, article }} />
        </CorrectInfoBox>

        <HorizontalLine />
        <AlternativeWordsSection document={document} />

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
      </Container>
    </SafeAreaView>
  )
}

export default VocabularyDetailScreen