import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../../../assets/images'
import RemoteLogo from '../../../components/RemoteLogo'
import ContentArea from '../../../models/ContentArea'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'

const MAIN_LOGO_SIZE = 96
const SECONDARY_LOGO_WIDTH = 72
const SECONDARY_LOGO_HEIGHT = 30

const Wrapper = styled.View`
  background-color: ${props => props.theme.colors.backgroundHeader};
`

const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const MainLogoContainer = styled.Pressable`
  position: absolute;
  align-self: center;
  bottom: -${props => props.theme.spacings.xxl};
`

const SecondaryLogo = styled(RemoteLogo)`
  margin-left: ${props => props.theme.spacings.md};
`

const MenuIconContainer = styled.TouchableOpacity`
  margin-left: auto;
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.xxs};
`

const HeaderMenuIcon = styled(MenuIcon)`
  padding: 0 ${props => props.theme.spacings.md};
  color: ${props => props.theme.colors.textOnHeader};
`

type MainLogoProps = {
  contentArea?: ContentArea
}

const MainLogo = ({ contentArea }: MainLogoProps): ReactElement => {
  const lunesLogo = <LunesIcon testID='lunes-logo' width={MAIN_LOGO_SIZE} height={MAIN_LOGO_SIZE} />

  if (contentArea?.branding?.logoUrl === undefined) {
    return lunesLogo
  }
  return (
    <RemoteLogo
      testID='main-logo'
      uri={contentArea.branding.logoUrl}
      width={MAIN_LOGO_SIZE}
      height={MAIN_LOGO_SIZE}
      fallback={lunesLogo}
      accessibilityRole='image'
      accessibilityLabel={contentArea.name}
    />
  )
}

type HomeScreenHeaderProps = {
  navigation: StackNavigationProp<RoutesParams, keyof RoutesParams>
  contentArea?: ContentArea
}

const HomeScreenHeader = ({ navigation, contentArea }: HomeScreenHeaderProps): ReactElement => (
  <Wrapper testID='header'>
    <MainLogoContainer>
      <MainLogo contentArea={contentArea} />
    </MainLogoContainer>
    <TopRow>
      {contentArea?.branding?.secondaryLogoUrl !== undefined && (
        <SecondaryLogo
          testID='secondary-logo'
          uri={contentArea.branding.secondaryLogoUrl}
          width={SECONDARY_LOGO_WIDTH}
          height={SECONDARY_LOGO_HEIGHT}
          accessible={false}
        />
      )}
      <MenuIconContainer onPress={() => navigation.navigate('OverlayMenu')}>
        <HeaderMenuIcon testID='menu-icon-white' accessibilityLabel={getLabels().general.header.menu} />
      </MenuIconContainer>
    </TopRow>
  </Wrapper>
)

export default HomeScreenHeader
