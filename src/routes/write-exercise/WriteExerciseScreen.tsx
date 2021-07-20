import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Keyboard, Pressable, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors'
import AnswerSection from './components/AnswerSection'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RouteProp } from '@react-navigation/native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '../../services/AsyncStorage'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import ExerciseHeader from '../../components/ExerciseHeader'
import {DocumentType} from "../../constants/endpoints";

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: hp('35%'),
    position: 'relative',
    resizeMode: 'cover'
  },
  spinner: {
    width: '100%',
    height: hp('35%'),
    position: 'absolute',
    top: 0,
    backgroundColor: COLORS.lunesWhite
  }
})

interface WriteExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenPropsType): JSX.Element => {
  const { extraParams, retryData } = route.params
  const { trainingSet, trainingSetId, disciplineTitle } = extraParams
  const [isLoading, setIsLoading] = useState(true)
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)
  const [docs, setDocs] = useState<DocumentType[]>([])
  const documents = useLoadDocuments(trainingSetId).data

  useEffect(() => {
    AsyncStorage.setSession(route.params).catch(e => console.error(e))
  }, [route.params])


  useEffect(()=>{
    if (documents && documents.length !== 0 && docs.length===0){
      setDocs(documents)
    }
  }, [documents])


  if (retryData) {
    setDocs(retryData.data)
  }

  const tryLater = (): void => {
    if (docs !== null) {
      const currDocument = docs[currentDocumentNumber]
      const newDocuments = docs.filter(d => d !== currDocument)
      newDocuments.push(currDocument)
      setDocs(newDocuments)
    }
  }

  const finishExercise = (): void => {
    AsyncStorage.clearSession().catch(e => console.error(e))
    setCurrentDocumentNumber(0)
    navigation.navigate('InitialSummary', { extraParams: { ...extraParams, results: [] } })
  }

  const docsLength = documents?.length ?? 0

  return (
      <Pressable onPress={() => Keyboard.dismiss()}>
        <ExerciseHeader
            navigation={navigation}
            route={route}
            currentWord={currentDocumentNumber}
            numberOfWords={docsLength}
        />

        {docs !== null && (
            <KeyboardAwareScrollView
                scrollEnabled={false}
                resetScrollToCoords={{ x: 0, y: 0 }}
                enableOnAndroid
                keyboardShouldPersistTaps='always'>
              {docs[currentDocumentNumber]?.document_image.length > 0 && (
                  <Image
                      source={{
                        uri: docs[currentDocumentNumber]?.document_image[0].image
                      }}
                      style={styles.image}
                      onLoadStart={() => setIsLoading(true)}
                      onLoad={() => setIsLoading(false)}
                  />
              )}
              {isLoading && <ActivityIndicator style={styles.spinner} />}

              <AnswerSection
                  currentDocumentNumber={currentDocumentNumber}
                  setCurrentDocumentNumber={setCurrentDocumentNumber}
                  documents={docs}
                  finishExercise={finishExercise}
                  tryLater={tryLater}
                  trainingSet={trainingSet}
                  disciplineTitle={disciplineTitle}
              />
            </KeyboardAwareScrollView>
        )}
      </Pressable>
  )
}

export default WriteExerciseScreen
