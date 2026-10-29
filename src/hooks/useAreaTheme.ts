import { Theme } from '../constants/theme'
import getAreaTheme from '../constants/theme/areaTheme'
import ContentArea from '../models/ContentArea'

const useAreaTheme = (contentArea: ContentArea | undefined): Theme => getAreaTheme(contentArea)

export default useAreaTheme
