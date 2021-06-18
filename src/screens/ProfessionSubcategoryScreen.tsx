import React, { useState } from 'react'
import { FlatList, LogBox, StatusBar, StyleSheet, Text, View } from 'react-native'
import Title from '../components/Title'
import axios from '../utils/axios'
import { ENDPOINTS, ProfessionSubcategoryType } from '../constants/endpoints'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import Loading from '../components/Loading'
import MenuItem from '../components/MenuItem'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingTop: 32
  },
  itemText: { flexDirection: 'row', alignItems: 'center' },
  list: {
    width: '100%'
  },
  description: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular'
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  clickedItemDescription: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    letterSpacing: undefined,
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-Regular'
  },
  badgeLabel: {
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('3%'),
    fontWeight: '600',
    minWidth: wp('6%'),
    height: wp('4%'),
    borderRadius: 8,
    backgroundColor: COLORS.lunesGreyMedium,
    overflow: 'hidden',
    textAlign: 'center'
  },
  clickedItemBadgeLabel: {
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    minWidth: wp('6%'),
    height: wp('4%'),
    borderRadius: 8,
    backgroundColor: COLORS.lunesWhite,
    overflow: 'hidden',
    textAlign: 'center'
  }
})

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

interface ProfessionSubcategoryScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ProfessionSubcategory'>
  navigation: StackNavigationProp<RoutesParamsType, 'ProfessionSubcategory'>
}

const ProfessionSubcategoryScreen = ({ route, navigation }: ProfessionSubcategoryScreenPropsType): JSX.Element => {
  const { extraParams } = route.params
  const { disciplineID, disciplineTitle } = extraParams
  const [subcategories, setSubcategories] = useState<ProfessionSubcategoryType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [count, setCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(
    React.useCallback(() => {
      const url = ENDPOINTS.subCategories.all.replace(':id', disciplineID.toString())
      axios
        .get(url)
        .then(response => {
          setSubcategories(response.data)
          setCount(response.data.length)
          setError(null)
        })
        .catch(e => {
          setError(e.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
      setSelectedId(-1)
    }, [disciplineID])
  )

  const titleCOMP = (
    <Title>
      <>
        <Text style={styles.screenTitle}>{disciplineTitle}</Text>
        <Text style={styles.description}>
          {count} {count === 1 ? 'Kategorie' : 'Kategorien'}
        </Text>
      </>
    </Title>
  )

  const Item = ({ item }: { item: ProfessionSubcategoryType }): JSX.Element | null => {
    if (item.total_documents === 0) {
      return null
    }
    const selected = item.id === selectedId
    const descriptionStyle = selected ? styles.clickedItemDescription : styles.description
    const badgeStyle = selected ? styles.clickedItemBadgeLabel : styles.badgeLabel

    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <View style={styles.itemText}>
          <Text style={badgeStyle}>{item.total_documents}</Text>
          <Text style={descriptionStyle}>{item.total_documents === 1 ? ' Lektion' : ' Lektionen'}</Text>
        </View>
      </MenuItem>
    )
  }

  const handleNavigation = (item: ProfessionSubcategoryType): void => {
    setSelectedId(item.id)
    navigation.navigate('Exercises', {
      extraParams: {
        ...extraParams,
        trainingSetId: item.id,
        trainingSet: item.title
      }
    })
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <Loading isLoading={isLoading}>
        {error !== null && <Text>{error}</Text>}
        <FlatList
          data={subcategories}
          style={styles.list}
          ListHeaderComponent={titleCOMP}
          renderItem={Item}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
    </View>
  )
}

export default ProfessionSubcategoryScreen
