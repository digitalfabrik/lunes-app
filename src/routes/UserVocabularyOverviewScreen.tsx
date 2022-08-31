import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { BookIconBlack } from '../../assets/images'
import ListItem from '../components/ListItem'
import RouteWrapper from '../components/RouteWrapper'
import { TitleSpacing } from '../components/Title'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Root = styled.View`
  padding: ${props => props.theme.spacings.md};
`

interface PropsType {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyOverview'>
}

const UserVocabularyOverviewScreen = ({ navigation }: PropsType): JSX.Element => {
  const { myWords } = getLabels().ownVocabulary
  return (
    <RouteWrapper>
      <Root>
        <TitleSpacing title={myWords} />
        <ListItem
          icon={<BookIconBlack />}
          title={getLabels().ownVocabulary.overview.list}
          onPress={() => navigation.navigate('UserVocabularyOverview')}
        />
        <ListItem
          icon={<BookIconBlack />}
          title={getLabels().ownVocabulary.overview.create}
          onPress={() => navigation.navigate('UserVocabularyEdit', { title: myWords })}
        />
        <ListItem
          icon={<BookIconBlack />}
          title={getLabels().ownVocabulary.overview.practice}
          onPress={() => navigation.navigate('UserVocabularyOverview')}
        />
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyOverviewScreen
