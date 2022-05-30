import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { childrenLabel } from '../../../services/helpers'
import { ButtonContainer, NumberText, UnitText } from './DisciplineCard'

const TextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

interface PropsType {
  discipline: Discipline
}

const CustomDisciplineDetails = ({ discipline }: PropsType): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RoutesParams, 'Home'>>()

  const navigate = (): void => {
    navigation.navigate('DisciplineSelection', {
      discipline
    })
  }

  return (
    <>
      <TextContainer>
        <NumberText>{discipline.numberOfChildren}</NumberText>
        <UnitText>{childrenLabel(discipline)}</UnitText>
      </TextContainer>
      <ButtonContainer>
        <Button onPress={navigate} label={labels.home.start} buttonTheme={BUTTONS_THEME.outlined} />
      </ButtonContainer>
    </>
  )
}

export default CustomDisciplineDetails
