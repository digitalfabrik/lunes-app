import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Linking, Modal, Text, AppState, AppStateStatus } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconBlue, CloseCircleIconWhite } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.white};
`

const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
`

const Camera = styled(RNCamera)`
  flex: 1;
  position: relative;
  margin: 50px 0 0;
`

const NotAuthorisedView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`

const NoAuthDescription = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium};
  padding: ${hp('30%')}px 0 20px;
`

interface Props {
  visible: boolean
  setVisible: (input: boolean) => void
  setCode: (input: string) => void
  navigation: StackNavigationProp<RoutesParams, 'AddCustomDiscipline'>
}

const AddCustomDisciplineScreen = ({ setVisible, setCode }: Props): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const camera = useRef<RNCamera>(null)
  const [refresh1, setRefresh] = useState<number>(0)

  const onBarCodeRead = (scanResult: any) => {
    if (scanResult.data != null) {
      setCode(scanResult.data)
      setVisible(false)
    }
  }

  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState<AppStateStatus>(appState.current)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // console.log('App become foreground')
      }
      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })
    return () => {
      subscription.remove()
    }
  }, [])

  const refresh = () => {
    Linking.openSettings()
      .then(() => {
        // console.log('yes')
        // setRefresh(1)
      })
      .catch(() => console.log('no'))
    // TODO wenn man von den settings zurück kommt, dann soll gleich der prompt kommen oder die Kamera funktionieren
    // jetzt geht es, dass man erst auf "Zulassen" klickt, dann zurück zur App geht, dann refresh klickt, aber nur wenn refresh1 auch als key für die Kamera gesetzt ist
  }

  return (
    <Modal testID='modal' visible transparent animationType='fade'>
      <Container>
        <Icon
          onPress={() => setVisible(false)}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}>
          {isPressed ? <CloseCircleIconBlue /> : <CloseCircleIconWhite />}
          {/* TODO add blue button when finished from designers */}
        </Icon>
        <Text>{appStateVisible}</Text>
        <Camera
          ref={camera}
          key={`refresh1-key-${refresh1}`}
          captureAudio={false}
          onBarCodeRead={onBarCodeRead}
          type={RNCamera.Constants.Type.back}
          /* onStatusChange={status => console.log('changed to ', status.cameraStatus)} */
          notAuthorizedView={
            <NotAuthorisedView>
              <NoAuthDescription>
                {labels.addCustomDiscipline.qrCodeScanner.noAuthorization.description}
              </NoAuthDescription>
              <Button
                onPress={() => setVisible(false)}
                label={labels.addCustomDiscipline.qrCodeScanner.noAuthorization.back}
                buttonTheme={BUTTONS_THEME.outlined}
              />
              <Button
                onPress={() => refresh()}
                label={labels.addCustomDiscipline.qrCodeScanner.noAuthorization.grant}
                buttonTheme={BUTTONS_THEME.contained}
              />
              <Button
                onPress={() => {
                  setRefresh(oldVal => oldVal + 1)
                }}
                label='refresh'
                buttonTheme={BUTTONS_THEME.contained}
              />
            </NotAuthorisedView>
          }
        />
      </Container>
    </Modal>
  )
}

export default AddCustomDisciplineScreen
