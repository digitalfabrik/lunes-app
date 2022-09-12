import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { AddIconWhite, BookIconBlack } from '../../assets/images'
import Button from '../components/Button'
import ListItem from '../components/ListItem'
import RouteWrapper from '../components/RouteWrapper'
import { Heading } from '../components/text/Heading'
import { BUTTONS_THEME } from '../constants/data'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Root = styled.View`
  flex: 1;
  padding: ${props => props.theme.spacings.md};
`

const StyledHeading = styled(Heading)`
  text-align: center;
  margin: ${props => props.theme.spacings.sm};
`

const Margin = styled.View`
  margin: ${props => props.theme.spacings.xl};
`

const StyledButton = styled(Button)`
  margin: ${props => props.theme.spacings.md} auto;
`

interface PropsType {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyOverview'>
}

const UserVocabularyOverviewScreen = ({ navigation }: PropsType): JSX.Element => (
  <RouteWrapper>
    <Root>
      <StyledHeading>{getLabels().userVocabulary.myWords}</StyledHeading>
      <Margin />
      <ListItem
        icon={<BookIconBlack />}
        title={getLabels().userVocabulary.overview.list}
        onPress={() => navigation.navigate('UserVocabularyList')}
      />
      <ListItem
        icon={<BookIconBlack />}
        title={getLabels().userVocabulary.overview.practice}
        onPress={() => navigation.navigate('UserVocabularyOverview')}
      />
    </Root>
    <StyledButton
      onPress={() => navigation.navigate('UserVocabularyOverview')}
      label={getLabels().userVocabulary.create}
      buttonTheme={BUTTONS_THEME.contained}
      iconRight={AddIconWhite}
    />
  </RouteWrapper>
)

export default UserVocabularyOverviewScreen
