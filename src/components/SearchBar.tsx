import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import { MagnifierIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import CustomTextInput from './CustomTextInput'

type SearchBarProps = {
  query: string
  setQuery: (input: string) => void
  placeholder?: string
  style?: StyleProp<ViewStyle>
}

const SearchBar = ({
  query,
  setQuery,
  placeholder = getLabels().search.enterWord,
  style,
}: SearchBarProps): ReactElement => {
  const theme = useTheme()
  return (
    <CustomTextInput
      value={query}
      clearable
      onChangeText={setQuery}
      placeholder={placeholder}
      rightContainer={<MagnifierIcon width={theme.spacingsPlain.md} height={theme.spacingsPlain.md} />}
      style={style}
    />
  )
}

export default SearchBar
