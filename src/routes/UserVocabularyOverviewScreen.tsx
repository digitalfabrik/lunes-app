import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { BookIconBlack } from '../../assets/images'
import ListItem from '../components/ListItem'
import RouteWrapper from '../components/RouteWrapper'
import { Heading } from '../components/text/Heading'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Root = styled.View`
  padding: ${props => props.theme.spacings.md};
`

const StyledHeading = styled(Heading)`
  text-align: center;
  margin: ${props => props.theme.spacings.sm};
`

const Margin = styled.View`
  margin: ${props => props.theme.spacings.xl};
`

interface PropsType {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyOverview'>
}

const UserVocabularyOverviewScreen = ({ navigation }: PropsType): JSX.Element => (
  <RouteWrapper>
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
  </RouteWrapper>
)

export default UserVocabularyOverviewScreen
