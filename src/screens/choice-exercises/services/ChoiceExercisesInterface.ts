import { DocumentsType } from '../../../constants/endpoints'
import { SingleChoiceListItemType } from '../components/SingleChoiceListItem'

export interface ChoiceExercisesInterface {
  buildAnswerOptions: (documents: DocumentsType, currentWord: number, count?: number) => SingleChoiceListItemType[]
}
