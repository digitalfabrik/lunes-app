import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react'
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

interface DropdownProps<T> {
  placeholder: string
  items: ItemType<string | number>[]
  itemKey: string
  multiSelect?: boolean
  setValue: Dispatch<SetStateAction<T | null>>
  value: T | null
  schema?: { label: string; value: string }
}

const StyledDropDownPicker = styled(DropDownPicker)<{ selected: boolean }>`
  border-radius: 0;
  height: 60px;
  border: 1px solid ${props => (props.selected ? props.theme.colors.primary : props.theme.colors.textSecondary)};
`

const Dropdown = <T extends ValueType>({
  items,
  itemKey,
  placeholder,
  multiSelect = false,
  value,
  setValue,
  schema = { label: 'label', value: 'id' },
}: DropdownProps<T>): ReactElement => {
  const theme = useTheme()
  const [open, setOpen] = useState<boolean>(false)
  return (
    <StyledDropDownPicker
      multiple={multiSelect}
      selected={open}
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
  )
}

export default Dropdown
