import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

// This hook listens to the keyboard and returns boolean whether keyboard is opened or closed

interface UseKeyboardProps {
  isKeyboardVisible: boolean
  keyboardHeight: number
}

export const useKeyboard = (): UseKeyboardProps => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardVisible(true)
      setKeyboardHeight(e.endCoordinates.height)
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
