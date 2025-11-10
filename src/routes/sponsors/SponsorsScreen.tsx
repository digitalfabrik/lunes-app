import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { Subheading } from '../../components/text/Subheading'
import useLoadSponsors from '../../hooks/useLoadSponsors'
import Sponsor from '../../models/sponsor'
import { getLabels } from '../../services/helpers'
import { openExternalUrl } from '../../services/url'

const List = styled.FlatList`
  margin: 0 ${props => props.theme.spacings.md};
  height: 100%;
` as unknown as typeof FlatList

const SponsorsHeading = styled(Heading)`
  padding-top: ${props => props.theme.spacings.xl};
  padding-bottom: ${props => props.theme.spacings.xs};
  text-align: center;
`
const SponsorsSubHeading = styled(ContentSecondary)`
  margin-bottom: ${props => props.theme.spacings.sm};
  text-align: center;
`

const Icon = styled.Image`
  max-width: 30%;
  height: 100%;
  aspect-ratio: 1;
  margin: 0 ${props => props.theme.spacings.xxs};
`

const SponsorName = styled(Subheading)`
  flex-shrink: 1;
`

const ItemContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  min-height: ${hp('17%')}px;
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.disabled};
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.sm};
  margin: ${props => props.theme.spacings.xs} ${props => props.theme.spacings.xxs};
`

const SponsorsScreen = (): ReactElement => {
  const { data, loading, error, refresh } = useLoadSponsors()

  const renderListItem = ({ item }: { item: Sponsor }): ReactElement => (
    <ItemContainer onPress={() => (item.url ? openExternalUrl(item.url) : null)}>
      <SponsorName>{item.name}</SponsorName>
      {!!item.logo && <Icon source={{ uri: item.logo }} resizeMode='contain' />}
    </ItemContainer>
  )

  return (
    <RouteWrapper>
      <SponsorsHeading>{getLabels().sponsors.sponsors}</SponsorsHeading>
      <SponsorsSubHeading>{getLabels().sponsors.sponsorsExplanation}</SponsorsSubHeading>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <List data={data} renderItem={renderListItem} showsVerticalScrollIndicator={false} />
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default SponsorsScreen
