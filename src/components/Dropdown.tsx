import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react'
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { Color } from '../constants/theme/colors'
import { ContentError } from './text/Content'

const StyledDropDownPicker = styled(DropDownPicker)<{ borderColor: string }>`
  border-radius: 0;
  height: 60px;
  border: 1px solid ${props => props.borderColor};
`

const ErrorContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xs}
  min-height: ${props => props.theme.spacings.lg};
`

interface DropdownProps<T> {
  placeholder: string
  items: ItemType<string | number>[]
  itemKey: string
  multiSelect?: boolean
  setValue: Dispatch<SetStateAction<T | null>>
  value: T | null
  schema?: { label: string; value: string }
  errorMessage?: string
}

const Dropdown = <T extends ValueType>({
  items,
  itemKey,
  placeholder,
  multiSelect = false,
  value,
  setValue,
  schema = { label: 'label', value: 'id' },
  errorMessage,
}: DropdownProps<T>): ReactElement => {
  const theme = useTheme()
  const [open, setOpen] = useState<boolean>(false)
  const showErrorValidation = errorMessage !== undefined

  const getBorderColor = (): Color => {
    if (errorMessage) {
      return theme.colors.incorrect
    }
    if (!value) {
      return theme.colors.textSecondary
    }

    return theme.colors.primary
  }
  return (
    <>
      <StyledDropDownPicker
        multiple={multiSelect}
        borderColor={getBorderColor()}
        open={open}
        setOpen={setOpen}
        setValue={setValue}
        value={value}
        items={items}
        schema={schema}
        itemKey={itemKey}
        placeholder={placeholder}
        labelStyle={{ fontSize: wp('4%'), paddingHorizontal: wp('2%') }}
        placeholderStyle={{
          fontSize: wp('4%'),
          fontFamily: theme.fonts.contentFontRegular,
          color: theme.colors.textSecondary,
          paddingHorizontal: wp('2%'),
        }}
        dropDownContainerStyle={{ borderRadius: 0 }}
        listItemLabelStyle={{
          fontSize: wp('4%'),
          fontFamily: theme.fonts.contentFontRegular,
          paddingHorizontal: wp('2%'),
        }}
      />
      {showErrorValidation && (
        <ErrorContainer>{errorMessage.length > 0 && <ContentError>{errorMessage}</ContentError>}</ErrorContainer>
      )}
    </>
  )
}

export default Dropdown
