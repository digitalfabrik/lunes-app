import React, { useState } from 'react'
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import Modal from '../components/Modal'
import { ProgressBar } from 'react-native-paper'
import { COLORS } from '../constants/colors'
import AnswerSection from '../components/AnswerSection'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CloseButton } from '../../assets/images'
import { RouteProp } from '@react-navigation/native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '../utils/AsyncStorage'
import labels from '../constants/labels.json'
import useLoadDocuments from '../hooks/useLoadDocuments'
import ExerciseHeader from "../components/ExerciseHeader";

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressBar: {
    backgroundColor: COLORS.lunesBlackUltralight
  },
  image: {
    width: '100%',
    height: hp('35%'),
    position: 'relative',
    resizeMode: 'cover'
  },
  headerText: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesGreyMedium
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    textTransform: 'uppercase',
    fontWeight: '600',
    marginLeft: 15
  },
  headerLeft: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100
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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)

  let documents = useLoadDocuments(trainingSetId).data

  if (retryData) {
    documents = retryData.data
  }

  React.useLayoutEffect(() => {
    const bEvent = BackHandler.addEventListener('hardwareBackPress', showModal)

    AsyncStorage.setSession(route.params).catch(e => console.error(e))
    return () => bEvent.remove()
  }, [route.params])

  const showModal = (): boolean => {
    setIsModalVisible(true)
    return true
  }

  const tryLater = (): void => {
    if (documents !== null) {
      const currDocument = documents[currentDocumentNumber]
      const newDocuments = documents.filter(d => d !== currDocument)
      newDocuments.push(currDocument)
      documents = newDocuments
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
      <ExerciseHeader navigation={navigation} extraParams={route?.params} currentWord={currentDocumentNumber} numberOfWords={docsLength} />
      <ProgressBar
        progress={docsLength > 0 ? currentDocumentNumber / docsLength : 0}
        color={COLORS.lunesGreenMedium}
        style={styles.progressBar}
        accessibilityComponentType
        accessibilityTraits
      />

      {documents !== null && (
        <KeyboardAwareScrollView
          scrollEnabled={false}
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid
          keyboardShouldPersistTaps='always'>
          {documents[currentDocumentNumber]?.document_image.length > 0 && (
            <Image
              source={{
                uri: documents[currentDocumentNumber]?.document_image[0].image
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
            documents={documents}
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
