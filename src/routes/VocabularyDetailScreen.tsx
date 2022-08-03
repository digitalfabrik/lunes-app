import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ArrowRightIcon, CrystalBallIcon } from '../../assets/images'
import Button from '../components/Button'
import DocumentImageSection from '../components/DocumentImageSection'
import ExerciseHeader from '../components/ExerciseHeader'
import HorizontalLine from '../components/HorizontalLine'
import WordItem from '../components/WordItem'
import { ContentSecondary, ContentTextBold } from '../components/text/Content'
import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import theme from '../constants/theme'
import { RoutesParams } from '../navigation/NavigationTypes'

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

const AlternativeWordHeading = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs} 0;
`

const AlternativeWords = styled(ContentSecondary)`
  margin-bottom: ${props => props.theme.spacings.md};
`

const AlternativesContainer = styled.View`
  flex-direction: row;
`

const AlternativesContent = styled.View`
  padding: 0 10px;
`

const SuggestAlternativeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.xs} 0 ${props => props.theme.spacings.xxl};
`

const Label = styled(ContentTextBold)`
  text-transform: uppercase;
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

        <AlternativesContainer>
          <CrystalBallIcon width={wp('8%')} height={wp('8%')} />
          <AlternativesContent>
            {document.alternatives.length > 0 && (
              <>
                <AlternativeWordHeading>{labels.exercises.vocabularyList.alternativeWords}</AlternativeWordHeading>
                <AlternativeWords>
                  {document.alternatives.map(value => `${value.article.value} ${value.word}`).join(', ')}
                </AlternativeWords>
              </>
            )}

            {/* Will be implemented in LUN-269 */}
            <SuggestAlternativeContainer>
              <Label>{labels.exercises.vocabularyList.suggestAlternative}</Label>
              <ArrowRightIcon fill={theme.colors.black} width={wp('6%')} height={wp('6%')} />
            </SuggestAlternativeContainer>
          </AlternativesContent>
        </AlternativesContainer>

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
