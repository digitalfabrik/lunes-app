import React, { useState } from 'react'
import { FlatList, LogBox, StatusBar, StyleSheet, Text, View } from 'react-native'
import Title from '../components/Title'
import { DisciplineType } from '../constants/endpoints'
import { RouteProp } from '@react-navigation/native'
import Loading from '../components/Loading'
import MenuItem from '../components/MenuItem'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'

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
    fontFamily: 'SourceSansPro-Regular',
    paddingLeft: 5
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
  const { module } = extraParams

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: disciplines, error, loading } = useLoadDisciplines(module)

  const titleCOMP = (
    <Title>
      <>
        <Text style={styles.screenTitle}>{module?.title}</Text>
        <Text style={styles.description}>
          {module.numberOfChildren} {module.numberOfChildren === 1 ? labels.home.unit : labels.home.units}
        </Text>
      </>
    </Title>
  )

  const ListItem = ({ item }: { item: DisciplineType }): JSX.Element | null => {
    if (item.numberOfChildren === 0) {
      return null
    }
    const selected = item.id === selectedId
    const descriptionStyle = selected ? styles.clickedItemDescription : styles.description
    const badgeStyle = selected ? styles.clickedItemBadgeLabel : styles.badgeLabel
    const descriptionForWord = item.numberOfChildren === 1 ? labels.home.word : labels.home.words
    const descriptionForUnit = item.numberOfChildren === 1 ? labels.home.unit : labels.home.units
    const description = module.isLeaf ? descriptionForWord : descriptionForUnit

    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <View style={styles.itemText}>
          <Text style={badgeStyle}>{item.numberOfChildren}</Text>
          <Text style={descriptionStyle}>{description}</Text>
        </View>
      </MenuItem>
    )
  }

  const handleNavigation = (selectedItem: DisciplineType): void => {
    setSelectedId(module.id)
    if (!module.isLeaf) {
      navigation.push('ProfessionSubcategory', {
        extraParams: {
          module: selectedItem,
          parentTitle: module.title
        }
      })
    } else {
      navigation.navigate('Exercises', {
        extraParams: {
          disciplineID: module.id,
          disciplineTitle: module.title,
          disciplineIcon: module.icon,
          trainingSetId: selectedItem.id,
          trainingSet: selectedItem.title,
          documentsLength: selectedItem.numberOfChildren
        }
      })
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <Loading isLoading={loading}>
        <FlatList
          data={disciplines}
          style={styles.list}
          ListHeaderComponent={titleCOMP}
          renderItem={ListItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
      <Text>{error}</Text>
    </View>
  )
}

export default ProfessionSubcategoryScreen
