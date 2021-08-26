import React, { useState } from 'react'
import { FlatList, Text, TouchableOpacity} from 'react-native'
import { Home, HomeButtonPressed } from '../../../assets/images'
import { DocumentType } from '../../constants/endpoints'
import Title from '../../components/Title'
import VocabularyListItem from './components/VocabularyListItem'
import Loading from '../../components/Loading'
import { COLORS } from '../../constants/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../../constants/labels.json'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import styled from 'styled-components/native'

const Root = styled.View` 
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  width: 100%;
  padding-bottom: 0;
  padding-top: ${hp('5.6%')};
`
const ScreenTitle = styled.Text` 
  text-align: center;
  font-size: ${wp('5%')};
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
  margin-bottom: 4;
`
const StyledList = (styled.FlatList`
  width: 100%;
`as unknown) as typeof FlatList; 

const Description = styled.Text` 
  text-align: center;
  font-size: ${wp('4%')};
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
`

interface VocabularyListScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyList'>
}

const VocabularyListScreen = ({ navigation, route }: VocabularyListScreenPropsType): JSX.Element => {
  const { trainingSetId } = route.params.extraParams
  const [isHomeButtonPressed, setIsHomeButtonPressed] = useState<boolean>(false)

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

  const { data: documents, error, loading } = useLoadDocuments(trainingSetId)

  const Header = (
    <Title>
      <>
        <ScreenTitle>{labels.exercises.vocabularyList.title}</ScreenTitle>
        <Description>
          {documents?.length} {documents?.length === 1 ? labels.home.word : labels.home.words}
        </Description>
      </>
    </Title>
  )

  const Item = ({ item }: { item: DocumentType }): JSX.Element => <VocabularyListItem document={item} />

  return (
    <Root>
      <Loading isLoading={loading}>
        <StyledList
          data={documents}
          ListHeaderComponent={Header}
          renderItem={Item}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
      {error && <Text>{error.message}</Text>}
    </Root>
  )
}

export default VocabularyListScreen
