import React, { ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'

import { CloseIcon, MagnifierIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import CustomTextInput from './CustomTextInput'

interface Props {
  query: string
  setQuery: (input: string) => void
}

const SearchBar = ({ query, setQuery }: Props): ReactElement => (
  <CustomTextInput
    value={query}
    onChangeText={setQuery}
    placeholder={labels.dictionary.enterWord}
    rightContainer={
      <TouchableOpacity onPress={() => setQuery('')}>
        {query === '' ? <MagnifierIcon /> : <CloseIcon />}
      </TouchableOpacity>
    }
  />
)

export default SearchBar
