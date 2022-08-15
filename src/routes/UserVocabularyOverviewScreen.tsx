import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { BookIconBlack, ListIcon } from '../../assets/images'
import ListItem from '../components/ListItem'
import { Heading } from '../components/text/Heading'
import theme from '../constants/theme'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Root = styled.View`
  padding: ${theme.spacings.md};
`

const StyledHeading = styled(Heading)`
  text-align: center;
  margin: ${theme.spacings.sm};
`

const Margin = styled.View`
  margin: ${theme.spacings.xl};
`

interface PropsType {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyOverview'>
}

const UserVocabularyOverviewScreen = ({ navigation }: PropsType) => (
  <Root>
    <StyledHeading>{getLabels().ownVocabulary.myVocabulary}</StyledHeading>
    <Margin />
    <ListItem
      icon={<BookIconBlack />}
      title={getLabels().ownVocabulary.overview.list}
      onPress={() => navigation.navigate('UserVocabularyOverview')}
    />
    <ListItem
      icon={<BookIconBlack />}
      title={getLabels().ownVocabulary.overview.create}
      onPress={() => navigation.navigate('UserVocabularyOverview')}
    />
    <ListItem
      icon={<BookIconBlack />}
      title={getLabels().ownVocabulary.overview.practice}
      onPress={() => navigation.navigate('UserVocabularyOverview')}
    />
  </Root>
)

export default UserVocabularyOverviewScreen
