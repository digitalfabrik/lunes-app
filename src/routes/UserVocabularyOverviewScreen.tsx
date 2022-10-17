import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { BookIconBlack } from '../../assets/images'
import ListItem from '../components/ListItem'
import RouteWrapper from '../components/RouteWrapper'
import { TitleWithSpacing } from '../components/Title'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Root = styled.View`
  padding: ${props => props.theme.spacings.md};
`

interface UserVocabularyOverviewScreenProps {
    navigation: StackNavigationProp<RoutesParams, 'UserVocabularyOverview'>
}

const UserVocabularyOverviewScreen = ({ navigation }: UserVocabularyOverviewScreenProps): JSX.Element => {
    const { myWords } = getLabels().userVocabulary
    const { list, create, practice } = getLabels().userVocabulary.overview
    return (
        <RouteWrapper>
            <Root>
                <TitleWithSpacing title={myWords} />
                <ListItem
                    icon={<BookIconBlack />}
                    title={list}
                    onPress={() => navigation.navigate('UserVocabularyList', { headerBackLabel: myWords })}
                />
                <ListItem
                    icon={<BookIconBlack />}
                    title={create}
                    onPress={() => navigation.navigate('UserVocabularyProcess', { headerBackLabel: myWords })}
                />
                <ListItem
                    icon={<BookIconBlack />}
                    title={practice}
                    onPress={() => navigation.navigate('UserVocabularyOverview')}
                />
            </Root>
        </RouteWrapper>
    )
}

export default UserVocabularyOverviewScreen