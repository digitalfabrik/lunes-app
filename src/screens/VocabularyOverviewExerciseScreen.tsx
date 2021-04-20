import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { IVocabularyOverviewScreen, IDocumentProps } from '../interfaces/exercise'
import { Home, HomeButtonPressed } from '../../assets/images'
import { ENDPOINTS } from '../constants/endpoints'
import axios from '../utils/axios'
import Title from '../components/Title'
import VocabularyOverviewListItem from '../components/VocabularyOverviewListItem'
import Loading from '../components/Loading'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

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

const VocabularyOverviewExerciseScreen = ({ navigation, route }: IVocabularyOverviewScreen) => {
  const { trainingSetId } = route.params.extraParams
  const [documents, setDocuments] = useState<IDocumentProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [isHomeButtonPressed, setIsHomeButtonPressed] = useState(false)

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          // TODO LUN-5 Fix and remove disable eslint
          // eslint-disable-next-line react/prop-types
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
    axios.get(url).then(response => {
      setDocuments(response.data)
      setCount(response.data.length)
      setIsLoading(false)
    })
  }, [trainingSetId])

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>Vocabulary Overview</Text>
        <Text style={styles.description}>
          {count} {count === 1 ? 'Word' : 'Words'}
        </Text>
      </>
    </Title>
  )

  const Item = ({ item }: any) => (
    <VocabularyOverviewListItem
      id={item.id}
      word={item.word}
      article={item.article}
      image={item.image}
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
    </View>
  )
}

export default VocabularyOverviewExerciseScreen
