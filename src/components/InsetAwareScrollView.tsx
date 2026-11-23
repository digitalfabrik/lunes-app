import React, { ReactElement, ReactNode } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type InsetAwareScrollViewProps = {
  children: ReactNode
}

const InsetAwareScrollView = ({ children }: InsetAwareScrollViewProps): ReactElement => {
  const insets = useSafeAreaInsets()
  return <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }}>{children}</ScrollView>
}

export default InsetAwareScrollView
