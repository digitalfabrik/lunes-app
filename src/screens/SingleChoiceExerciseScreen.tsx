import React, { useEffect, useState } from 'react'
import { SingleChoice } from '../components/SingleChoice'
import { SingleChoiceListItemType } from '../components/SingleChoiceListItem'
import { DocumentsType, ENDPOINTS } from '../constants/endpoints'
import axios from '../utils/axios'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { BUTTONS_THEME } from '../constants/data'
import Button from '../components/Button'
import { Text } from 'react-native'
import { WhiteNextArrow } from '../../assets/images'
import { styles } from '../components/Actions'

interface SingleChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyOverview'>
}

const SingleChoiceExerciseScreen = ({ navigation, route }: SingleChoiceExerciseScreenPropsType) => {
  const { trainingSetId } = route.params.extraParams
  const [documents, setDocuments] = useState<DocumentsType>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAnswerClicked, setIsAnswerClicked] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [answerOptions, setAnswerOptions] = useState<SingleChoiceListItemType[]>([])
  const [currentWord, setCurrentWord] = useState<number>(0)

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
    axios.get(url).then(response => {
      setDocuments(response.data)
      setCount(response.data.length)
      setIsLoading(false)
    })
  }, [trainingSetId])

  const buildAnswerOption = React.useCallback(() => {}, [currentWord, documents])

  useEffect(() => {
    buildAnswerOption()
  }, [documents, currentWord, buildAnswerOption])

  const onClick = () => {}

  const getNextWord = () => {
    setCurrentWord(prevState => prevState + 1)
  }

  return (
    <>
      {!isLoading && <SingleChoice answerOptions={answerOptions} onClick={onClick} />}
      {isAnswerClicked && (
        <Button onPress={getNextWord} theme={BUTTONS_THEME.dark}>
          <>
            <Text style={[styles.lightLabel, styles.arrowLabel]}>
              {currentWord >= count ? 'ERGEBNISE' : 'NÄCHSTES WORT'}
            </Text>
            <WhiteNextArrow />
          </>
        </Button>
      )}
    </>
  )
}

export default SingleChoiceExerciseScreen
