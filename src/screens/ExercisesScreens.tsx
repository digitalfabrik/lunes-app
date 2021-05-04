import React, { useState } from 'react'
import { View, Text, LogBox, TouchableOpacity, FlatList, Pressable, StyleSheet } from 'react-native'
import { IExercisesScreenProps } from '../interfaces/exercises'
import { Home, Arrow, BackButton, BackArrowPressed, HomeButtonPressed } from '../../assets/images'
import Title from '../components/Title'
import { EXERCISES, SCREENS } from '../constants/data'
import { useFocusEffect } from '@react-navigation/native'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

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
  },
  headerLeft: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100
  }
})

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

const ExercisesScreen = ({ route, navigation }: IExercisesScreenProps) => {
  const { extraParams } = route.params
  const { trainingSet, disciplineTitle } = extraParams
  const [selectedId, setSelectedId] = useState(-1)
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false)
  const [isHomeButtonPressed, setIsHomeButtonPressed] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      setSelectedId(-1)

      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            // TODO LUN-5 Fix and remove disable eslint
            // eslint-disable-next-line react/prop-types
            onPress={() => navigation.navigate(SCREENS.profession)}
            onPressIn={() => setIsHomeButtonPressed(true)}
            onPressOut={() => setIsHomeButtonPressed(false)}
            activeOpacity={1}>
            {isHomeButtonPressed ? <HomeButtonPressed /> : <Home />}
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity
            // TODO LUN-5 Fix and remove disable eslint
            // eslint-disable-next-line react/prop-types
            onPress={() => navigation.navigate(SCREENS.professionSubcategory, { extraParams })}
            onPressIn={() => setIsBackButtonPressed(true)}
            onPressOut={() => setIsBackButtonPressed(false)}
            activeOpacity={1}
            style={styles.headerLeft}>
            {isBackButtonPressed ? <BackArrowPressed /> : <BackButton />}
            <Text style={styles.title}>{disciplineTitle}</Text>
          </TouchableOpacity>
        )
      })
    }, [extraParams, navigation, disciplineTitle, isBackButtonPressed, isHomeButtonPressed])
  )

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>{trainingSet}</Text>
        <Text style={styles.screenDescription}>2 Exercises</Text>
      </>
    </Title>
  )

  const Item = ({ item }: any) => {
    const selected = item.id === selectedId
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
        <Arrow fill={item.id === selectedId ? COLORS.lunesRedLight : COLORS.lunesBlack} />
      </Pressable>
    )
  }

  const handleNavigation = (item: any) => {
    setSelectedId(item.id)
    navigation.push(item.nextScreen, {
      extraParams: {
        ...extraParams,
        exercise: item.title,
        exerciseDescription: item.description,
        Level: item.Level
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
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default ExercisesScreen
