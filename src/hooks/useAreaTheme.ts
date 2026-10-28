import { useMemo } from 'react'

import { Theme } from '../constants/theme'
import getAreaTheme from '../constants/theme/areaTheme'
import ContentArea from '../models/ContentArea'

const useAreaTheme = (contentArea: ContentArea | undefined): Theme =>
  useMemo(() => getAreaTheme(contentArea), [contentArea])

export default useAreaTheme
