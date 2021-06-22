import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { Home, HomeButtonPressed } from '../../assets/images'
import { DocumentsType, DocumentType, ENDPOINTS } from '../constants/endpoints'
import axios from '../utils/axios'
import Title from '../components/Title'
import VocabularyOverviewListItem from '../components/VocabularyOverviewListItem'
import Loading from '../components/Loading'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    width: '100%',
    paddingBottom: 0,
    paddingTop: 32
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    marginBottom: 4
  },
  list: {
    width: '100%'
  },
  description: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular'
  }
})

interface VocabularyOverviewExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyOverview'>
}

const VocabularyOverviewExerciseScreen = ({
  navigation,
  route
}: VocabularyOverviewExerciseScreenPropsType): JSX.Element => {
  const { trainingSetId } = route.params.extraParams
  const [documents, setDocuments] = useState<DocumentsType>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)
  const [isHomeButtonPressed, setIsHomeButtonPressed] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          onPressIn={() => setIsHomeButtonPressed(true)}
          onPressOut={() => setIsHomeButtonPressed(false)}
          activeOpacity={1}>
          {isHomeButtonPressed ? <HomeButtonPressed /> : <Home />}
        </TouchableOpacity>
      )
    })
  }, [navigation, isHomeButtonPressed])

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
    axios
      .get(url)
      .then(response => {
        setDocuments(response.data)
        setCount(response.data.length)
        setError(null)
      })
      .catch(e => {
        setError(e.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [trainingSetId])

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>Vokabelübersicht</Text>
        <Text style={styles.description}>
          {count} {count === 1 ? 'Wort' : 'Wörter'}
        </Text>
      </>
    </Title>
  )

  const Item = ({ item }: { item: DocumentType }): JSX.Element => (
    <VocabularyOverviewListItem
      id={item.id}
      word={item.word}
      article={item.article}
      image={item.document_image[0].image}
      audio={item.audio}
    />
  )

  return (
    <View style={styles.root}>
      <Loading isLoading={isLoading}>
        <FlatList
          data={documents}
          style={styles.list}
          ListHeaderComponent={Header}
          renderItem={Item}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
      <Text>{error}</Text>
    </View>
  )
}

export default VocabularyOverviewExerciseScreen
