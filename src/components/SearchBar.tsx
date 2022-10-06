import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { MagnifierIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import CustomTextInput from './CustomTextInput'

interface SearchBarProps {
  query: string
  setQuery: (input: string) => void
}

const SearchBar = ({ query, setQuery }: SearchBarProps): ReactElement => (
  <CustomTextInput
    value={query}
    clearable
    onChangeText={setQuery}
    placeholder={getLabels().search.enterWord}
    rightContainer={<MagnifierIcon width={hp('3%')} height={hp('3%')} />}
  />
)

export default SearchBar
