import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { AddIconWhite, BookIconBlack } from '../../assets/images'
import Button from '../components/Button'
import ListItem from '../components/ListItem'
import RouteWrapper from '../components/RouteWrapper'
import { BUTTONS_THEME } from '../constants/data'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Root = styled.View`
  padding: ${props => props.theme.spacings.md};
  height: 100%;
`

const ButtonContainer = styled.View`
  padding-bottom: ${props => props.theme.spacings.sm};
  position: absolute;
  align-self: center;
  bottom: 0px;
`

type UserVocabularyOverviewScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyOverview'>
}

const UserVocabularyOverviewScreen = ({ navigation }: UserVocabularyOverviewScreenProps): JSX.Element => {
  const { myWords } = getLabels().userVocabulary
  const { list, create, practice } = getLabels().userVocabulary.overview
  return (
    <RouteWrapper>
      <Root>
        <ListItem
          icon={<BookIconBlack />}
          title={list}
          onPress={() => navigation.navigate('UserVocabularyList', { headerBackLabel: myWords })}
        />
        <ListItem
          icon={<BookIconBlack />}
          title={practice}
          onPress={() => navigation.navigate('UserVocabularyDisciplineSelection')}
        />
        <ButtonContainer>
          <Button
            onPress={() => navigation.navigate('UserVocabularyProcess', { headerBackLabel: myWords })}
            label={create}
            buttonTheme={BUTTONS_THEME.contained}
            iconRight={AddIconWhite}
          />
        </ButtonContainer>
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyOverviewScreen
