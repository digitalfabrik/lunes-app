import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React,{useState} from 'react'
import { FlatList, Alert } from 'react-native'
import styled from 'styled-components/native'

import ListItem from '../components/ListItem'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { EXERCISES, Exercise } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'
import { MIN_WORDS } from './choice-exercises/WordChoiceExerciseScreen'

import Lane from './LockingLane'
import AAsyncStorage from '@react-native-async-storage/async-storage';


const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
`

interface ExercisesScreenProps {
  route: RouteProp<RoutesParams, 'Exercises'>
  navigation: StackNavigationProp<RoutesParams, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenProps): JSX.Element => {

  const[level,setLevel]=useState<string>('');

  const { discipline } = route.params
  const { title } = discipline

  const Header = <Title title={title} description={childrenDescription(discipline)} />

  const handleNavigation = (item: Exercise): void => {
    if (item.title === labels.exercises.wordChoice.title && discipline.numberOfChildren < MIN_WORDS) {
      Alert.alert(labels.exercises.wordChoice.errorWrongModuleSize)
    } else {
      navigation.navigate(EXERCISES[item.key].nextScreen, {
        discipline
      })
    }
  }
  
useFocusEffect(
  React.useCallback(()=>{
    AAsyncStorage.getItem('level').then((value)=>{
      if(value){
        const num:string=value;
        setLevel(num);
      }
    })
    
  },[navigation])
  )


  const Item = ({ item }: { item: Exercise }): JSX.Element | null => (
    <ListItem title={item.title} description={item.description} onPress={() => handleNavigation(item)}>
      <Trophy level={item.level} />
    </ListItem>
  )

  return (
    <Root style={{display:'flex',flexDirection:'row'}}>
      {/*  <Lane stepslocked={level}></Lane>*/ }
      <FlatList 
        data={EXERCISES}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={({ key }) => key.toString()}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default ExercisesScreen
