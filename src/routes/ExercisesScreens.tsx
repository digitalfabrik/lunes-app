import React, { ReactElement, useState } from 'react'
import { FlatList, LogBox, Pressable, StyleSheet, Text, View } from 'react-native'
import { Arrow } from '../../assets/images'
import Title from '../components/Title'
import { EXERCISES, ExerciseType } from '../constants/data'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingTop: 32
  },
  list: {
    width: '100%',
    paddingHorizontal: 16
  },
  screenDescription: {
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular'
  },
  description: {
    fontSize: wp('4%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular'
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  container: {
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2
  },
  clickedContainer: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.lunesBlack,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2
  },
  clickedItemTitle: {
    textAlign: 'left',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  clickedItemDescription: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.white,
    fontFamily: 'SourceSansPro-Regular'
  },
  level: {
    marginTop: 11
  },
  title2: {
    textAlign: 'left',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    textTransform: 'uppercase',
    fontWeight: '600',
    marginLeft: 15
  }
})

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

interface ExercisesScreenPropsType {
  route: RouteProp<RoutesParamsType, 'Exercises'>
  navigation: StackNavigationProp<RoutesParamsType, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenPropsType): ReactElement => {
  const { extraParams } = route.params
  const { trainingSet } = extraParams
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  useFocusEffect(
    React.useCallback(() => {
      setSelectedKey(null)
    }, [])
  )

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>{trainingSet}</Text>
        <Text style={styles.screenDescription}>4 {labels.home.exercises}</Text>
      </>
    </Title>
  )

  const Item = ({ item }: { item: ExerciseType }): JSX.Element | null => {
    const selected = item.key.toString() === selectedKey
    const itemStyle = selected ? styles.clickedContainer : styles.container
    const itemTitleStyle = selected ? styles.clickedItemTitle : styles.title2
    const descriptionStyle = selected ? styles.clickedItemDescription : styles.description

    return (
      <Pressable style={itemStyle} onPress={() => handleNavigation(item)}>
        <View>
          <Text style={itemTitleStyle}>{item.title}</Text>
          <Text style={descriptionStyle}>{item.description}</Text>
          <item.Level style={styles.level} />
        </View>
        <Arrow fill={item.key.toString() === selectedKey ? COLORS.lunesRedLight : COLORS.lunesBlack} />
      </Pressable>
    )
  }

  const handleNavigation = (item: ExerciseType): void => {
    setSelectedKey(item.key.toString())
    navigation.navigate(item.nextScreen, {
      extraParams: {
        ...extraParams,
        exercise: item.key,
        exerciseDescription: item.description,
        level: item.Level
      }
    })
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={EXERCISES}
        style={styles.list}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={item => item.key.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default ExercisesScreen
