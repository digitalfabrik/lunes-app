import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { CloseIcon, MagnifierIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import CustomTextInput from './CustomTextInput'

interface Props {
  value: string
  setValue: (input: string) => void
}

const SearchBar = ({ value, setValue }: Props) => (
  <CustomTextInput
    value={value}
    onChangeText={setValue}
    placeholder={labels.dictionary.enterWord}
    rightContainer={
      <TouchableOpacity onPress={() => setValue('')}>
        {value === '' ? <MagnifierIcon /> : <CloseIcon />}
      </TouchableOpacity>
    }
  />
)

export default SearchBar
