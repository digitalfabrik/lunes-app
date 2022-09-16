import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

interface UseKeyboardProps {
  isKeyboardVisible: boolean
  keyboardHeight: number
}

const useKeyboard = (): UseKeyboardProps => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ({ endCoordinates }: KeyboardEvent) => {
      setKeyboardVisible(true)
      setKeyboardHeight(endCoordinates.height)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
      setKeyboardHeight(0)
    })

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])
  return { isKeyboardVisible, keyboardHeight }
}

export default useKeyboard
