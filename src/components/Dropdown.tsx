import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import { StyleSheet } from 'react-native'
import { Dropdown as RNElementDropdown } from 'react-native-element-dropdown'
import styled from 'styled-components/native'

import theme from '../constants/theme'
import { ContentError } from './text/Content'

const ErrorContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xs};
  min-height: ${props => props.theme.spacings.lg};
`

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: theme.colors.textSecondary,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: theme.spacingsPlain.sm,
  },
  placeholderStyle: {
    fontSize: theme.fonts.defaultFontSizeWithoutUnit,
    color: theme.colors.placeholder,
  },
  selectedTextStyle: {
    fontSize: theme.fonts.defaultFontSizeWithoutUnit,
  },
})

type DropdownItemType = {
  value: string
  id: number
  label: string
}

type DropdownProps = {
  placeholder: string
  items: Array<DropdownItemType>
  setValue: Dispatch<SetStateAction<number | null>>
  value: string | null
  errorMessage?: string
}

const Dropdown = ({ items, placeholder, value, setValue, errorMessage }: DropdownProps): ReactElement => (
  <>
    <RNElementDropdown
      data={items}
      labelField='label'
      valueField='id'
      onChange={item => setValue(item.id)}
      placeholder={placeholder}
      style={[styles.dropdown, !!errorMessage && { borderColor: 'red' }]}
      value={value}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
    />
    {!!errorMessage && (
      <ErrorContainer>{errorMessage.length > 0 && <ContentError>{errorMessage}</ContentError>}</ErrorContainer>
    )}
  </>
)

export default Dropdown
