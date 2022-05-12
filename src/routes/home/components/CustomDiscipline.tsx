import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { GenericListItemContainer } from '../../../components/ListItem'
import Loading from '../../../components/Loading'
import { ContentSecondary, ContentSecondaryLight } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { childrenLabel } from '../../../services/helpers'
import Card from './Card'

const Placeholder = styled(GenericListItemContainer)`
  border: 1px solid ${prop => prop.theme.colors.disabled};
  height: ${hp('12%')}px;
`

const LoadingSpinner = styled.View`
  padding: ${props => props.theme.spacings.md};
`

const TextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

const NumberText = styled(Subheading)`
  font-size: ${props => props.theme.fonts.headingFontSize};
  padding: ${props => props.theme.spacings.xs};
`

const UnitText = styled(ContentSecondary)`
  font-size: ${props => props.theme.fonts.headingFontSize};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.xxs} auto;
`

interface CustomDisciplineItemProps {
  apiKey: string
  navigation: StackNavigationProp<RoutesParams, 'Home'>
}

const CustomDiscipline = ({ apiKey, navigation }: CustomDisciplineItemProps): JSX.Element => {
  const { data: discipline, loading } = useLoadDiscipline({ apiKey })

  const navigate = (): void => {
    if (!discipline) {
      return
    }
    navigation.navigate('DisciplineSelection', {
      discipline
    })
  }

  if (loading) {
    return (
      <Placeholder>
        {/* TODO adjust height of Placeholder (will be done in LUN-301) */}
        <LoadingSpinner>
          <Loading isLoading />
        </LoadingSpinner>
      </Placeholder>
    )
  }
  // TODO add loading handling LUN-301
  return (
    <>
      {discipline ? (
        <Card heading={discipline.title} icon={discipline.icon} onPress={navigate}>
          <>
            <TextContainer>
              <NumberText>{discipline.numberOfChildren}</NumberText>
              <UnitText>{childrenLabel(discipline)}</UnitText>
            </TextContainer>
            <ButtonContainer>
              <Button onPress={navigate} label={labels.home.start} buttonTheme={BUTTONS_THEME.outlined} />
            </ButtonContainer>
          </>
        </Card>
      ) : (
        <Placeholder>
          <ContentSecondaryLight>
            {labels.home.errorLoadCustomDiscipline} {apiKey}
          </ContentSecondaryLight>
        </Placeholder>
      )}
    </>
  )
}

export default CustomDiscipline
