import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../../../assets/images'
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

const MainLogoImage = styled.Image`
  width: ${MAIN_LOGO_SIZE}px;
  height: ${MAIN_LOGO_SIZE}px;
`

const SecondaryLogoImage = styled.Image`
  width: ${SECONDARY_LOGO_WIDTH}px;
  height: ${SECONDARY_LOGO_HEIGHT}px;
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
  const [hasLoadingFailed, setHasLoadingFailed] = useState<boolean>(false)

  if (contentArea?.logoUrl === undefined || hasLoadingFailed) {
    return <LunesIcon testID='lunes-logo' width={MAIN_LOGO_SIZE} height={MAIN_LOGO_SIZE} />
  }
  return (
    <MainLogoImage
      testID='main-logo'
      source={{ uri: contentArea.logoUrl }}
      resizeMode='contain'
      accessibilityRole='image'
      accessibilityLabel={contentArea.name}
      onError={() => setHasLoadingFailed(true)}
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
      <MainLogo key={contentArea?.logoUrl} contentArea={contentArea} />
    </MainLogoContainer>
    <TopRow>
      {contentArea?.secondaryLogoUrl !== undefined && (
        <SecondaryLogoImage
          testID='secondary-logo'
          source={{ uri: contentArea.secondaryLogoUrl }}
          resizeMode='contain'
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
