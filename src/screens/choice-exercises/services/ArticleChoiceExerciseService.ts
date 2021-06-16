import { SingleChoiceListItemType } from '../components/SingleChoiceListItem'
import { ARTICLES } from '../../../constants/data'
import { DocumentsType } from '../../../constants/endpoints'
import { ChoiceExercisesInterface } from './ChoiceExercisesInterface'

class ArticleChoiceExerciseService implements ChoiceExercisesInterface {
  buildAnswerOptions(documents: DocumentsType, currentWord: number): SingleChoiceListItemType[] {
    const word: string = documents[currentWord]?.word
    if (!word) {
      return []
    }
    const answerOptions: SingleChoiceListItemType[] = []
    for (const article of Object.values(ARTICLES)) {
      answerOptions.push({
        article,
        word,
        correct: false,
        pressed: false,
        selected: false,
        addOpacity: false
      })
    }
    return answerOptions
  }
}

export default ArticleChoiceExerciseService
