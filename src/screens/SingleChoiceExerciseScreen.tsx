import React, {useEffect, useState} from 'react'
import {SingleChoice} from '../components/SingleChoice'
import {SingleChoiceListItemType} from '../components/SingleChoiceListItem'
import {DocumentsType, ENDPOINTS} from "../constants/endpoints";
import axios from "../utils/axios";
import {RouteProp} from "@react-navigation/native";
import {RoutesParamsType} from "../navigation/NavigationTypes";
import {StackNavigationProp} from "@react-navigation/stack";
import {Article, ARTICLES} from "../constants/data";


interface SingleChoiceExerciseScreenPropsType {
    route: RouteProp<RoutesParamsType, 'VocabularyOverview'>
    navigation: StackNavigationProp<RoutesParamsType, 'VocabularyOverview'>
}

const SingleChoiceExerciseScreen = ({navigation, route}: SingleChoiceExerciseScreenPropsType) => {
    const {trainingSetId} = route.params.extraParams
    const [documents, setDocuments] = useState<DocumentsType>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [count, setCount] = useState<number>(0)
    const [answerOptions, setAnswerOptions] = useState<SingleChoiceListItemType[]>([])
    const [currentWord, setCurrentWord] = useState<number>(0)


    useEffect(() => {
        const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
        axios.get(url).then(response => {
            console.log('get')
            setDocuments(response.data)
            setCount(response.data.length)
            setIsLoading(false)
            buildAnswerOption()
        })
    }, [trainingSetId])

    const buildAnswerOption = () => {
        const word: string = documents[currentWord]?.word
        if(!word) {
            return;
        }
        console.log(word)
        const answerOptions: SingleChoiceListItemType[] = []
        for (const article of Object.values(ARTICLES)) {
            answerOptions.push({
                article,
                word,
                correct: false,
                pressed: false,
                selected: false,
                addOpacity: false
            })
        }
        setAnswerOptions(answerOptions)
    }

    const onClick = (article: Article) => {
        console.log(`clicked: ${article}`)
    }

    return (
        <>
            {(!isLoading) &&
            <SingleChoice answerOptions={answerOptions} onClick={onClick}/>}
        </>
    )
}

export default SingleChoiceExerciseScreen
