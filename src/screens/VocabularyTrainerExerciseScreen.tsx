import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
  Pressable,
  Keyboard
} from 'react-native'
import Modal from '../components/Modal'
import { ProgressBar } from 'react-native-paper'
import { COLORS } from '../constants/colors'
import axios from '../utils/axios'
import { DocumentsType, ENDPOINTS } from '../constants/endpoints'
import AnswerSection from '../components/AnswerSection'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CloseButton } from '../../assets/images'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '../utils/AsyncStorage'

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

interface VocabularyTrainerExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyTrainer'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyTrainer'>
}

const VocabularyTrainerExerciseScreen = ({
  navigation,
  route
}: VocabularyTrainerExerciseScreenPropsType): JSX.Element => {
  const { extraParams, retryData } = route.params
  const { trainingSet, trainingSetId, disciplineTitle } = extraParams
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [documents, setDocuments] = useState<DocumentsType>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(1)

  useFocusEffect(
    React.useCallback(() => {
      setCurrentDocumentNumber(0)
      const getDocuments = async (): Promise<void> => {
        try {
          const documentsRes =
            retryData !== undefined
              ? retryData
              : await axios.get(ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`))
          setDocuments(documentsRes.data)
          setCurrentDocumentNumber(0)
        } catch (error) {
          console.error(error)
        }
      }

      getDocuments()
    }, [retryData, trainingSetId])
  )

  React.useLayoutEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={showModal} style={styles.headerLeft}>
            <CloseButton />
            <Text style={styles.title}>Übung beenden</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Text style={styles.headerText}>{`${currentDocumentNumber + 1} of ${documents.length}`}</Text>
        )
      }),
    [navigation, currentDocumentNumber, documents]
  )

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
    const currDocument = documents[currentDocumentNumber]
    const newDocuments = documents.filter(d => d !== currDocument)
    newDocuments.push(currDocument)
    setDocuments(newDocuments)
  }

  const finishExercise = (): void => {
    AsyncStorage.clearSession().catch(e => console.error(e))
    navigation.navigate('InitialSummary', { extraParams })
  }

  const docsLength = documents.length

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <ProgressBar
        progress={docsLength > 0 ? currentDocumentNumber / docsLength : 0}
        color={COLORS.lunesGreenMedium}
        style={styles.progressBar}
        accessibilityComponentType
        accessibilityTraits
      />

      <KeyboardAwareScrollView
        scrollEnabled={false}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid
        keyboardShouldPersistTaps='always'>
        <Image
          source={{
            uri: documents[currentDocumentNumber]?.document_image[0].image
          }}
          style={styles.image}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
        />
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

      <Modal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        navigation={navigation}
        extraParams={extraParams}
      />
    </Pressable>
  )
}

export default VocabularyTrainerExerciseScreen
