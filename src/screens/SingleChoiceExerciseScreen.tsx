import React, {useEffect, useState} from 'react'
import {SingleChoice} from '../components/SingleChoice'
import {SingleChoiceListItemType} from '../components/SingleChoiceListItem'
import {DocumentsType, ENDPOINTS} from '../constants/endpoints'
import axios from '../utils/axios'
import {RouteProp} from '@react-navigation/native'
import {RoutesParamsType} from '../navigation/NavigationTypes'
import {StackNavigationProp} from '@react-navigation/stack'
import {BUTTONS_THEME, isArticle} from '../constants/data'
import Button from '../components/Button'
import {Text} from 'react-native'
import {WhiteNextArrow} from '../../assets/images'
import {styles} from '../components/Actions'

interface SingleChoiceExerciseScreenPropsType {
    route: RouteProp<RoutesParamsType, 'VocabularyOverview'>
    navigation: StackNavigationProp<RoutesParamsType, 'VocabularyOverview'>
}

const SingleChoiceExerciseScreen = ({navigation, route}: SingleChoiceExerciseScreenPropsType) => {
    const {trainingSetId} = route.params.extraParams
    const [documents, setDocuments] = useState<DocumentsType>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isFinished, setIsFinished] = useState<boolean>(false)
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

    const generateFalseAnswers = React.useCallback((answerOptions: SingleChoiceListItemType[]) => {
        const usedWords = [currentWord]
        for (let i = 0; i < 3; i++) {
            let rand: number
            do {
                rand = Math.floor(Math.random() * count)
            } while (usedWords.includes(rand))
            usedWords.push(rand)

            const {word, article} = documents[rand]
            if (!isArticle(article)) {
                return
            }

            answerOptions.push({
                article,
                word,
                correct: false,
                pressed: false,
                selected: false,
                addOpacity: false
            })
        }
    }, [count, currentWord, documents])

    const buildAnswerOption = React.useCallback(() => {
        const {word, article} = documents[currentWord] || {}

        if (!word || !isArticle(article) || count === 0) {
            return
        }

        const answerOptions: SingleChoiceListItemType[] = []
        generateFalseAnswers(answerOptions)

        const positionOfCorrectAnswer = Math.floor(Math.random() * 4)
        answerOptions.splice(positionOfCorrectAnswer, 0, {
            article,
            word,
            correct: false,
            pressed: false,
            selected: false,
            addOpacity: false
        })
        setAnswerOptions(answerOptions)
    }, [currentWord, documents, count, generateFalseAnswers])

    useEffect(() => {
        buildAnswerOption()
    }, [documents, currentWord, buildAnswerOption])

    const onClick = () => {
    }

    const getNextWord = () => {
        setCurrentWord(prevState => prevState + 1)
    }

    return (
        <>
            {!isLoading && <SingleChoice answerOptions={answerOptions} onClick={onClick}/>}
            {isFinished && (
                <Button onPress={getNextWord} theme={BUTTONS_THEME.dark}>
                    <>
                        <Text style={[styles.lightLabel, styles.arrowLabel]}>
                            {currentWord >= count ? 'ERGEBNISE' : 'NÄCHSTES WORT'}
                        </Text>
                        <WhiteNextArrow/>
                    </>
                </Button>
            )}
        </>
    )
}

export default SingleChoiceExerciseScreen
