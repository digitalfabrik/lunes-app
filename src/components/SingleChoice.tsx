import React from 'react'
import { StyleSheet, View } from 'react-native'
import SingleChoiceListItem, { ISingleChoiceListItemProps } from './SingleChoiceListItem'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 35
  }
})

export interface ISingleChoiceProps {
  answerOptions: ISingleChoiceListItemProps[]
}

export const SingleChoice = ({ answerOptions }: ISingleChoiceProps) => {
  return (
    <View style={styles.container}>
      {answerOptions.map((a, index) => {
        return (
          <SingleChoiceListItem
            key={index}
            word={a.word}
            article={a.article}
            correct={a.correct}
            selected={a.selected}
            addOpacity={a.addOpacity}
          />
        )
      })}
    </View>
  )
}
