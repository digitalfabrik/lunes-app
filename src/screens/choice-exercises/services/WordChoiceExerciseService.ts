import { SingleChoiceListItemType } from '../components/SingleChoiceListItem'
import { isArticle } from '../../../constants/data'
import { DocumentsType } from '../../../constants/endpoints'
import { ChoiceExercisesInterface } from './ChoiceExercisesInterface'

class WordChoiceExerciseService implements ChoiceExercisesInterface {
  generateFalseAnswers(
    answerOptions: SingleChoiceListItemType[],
    currentWord: number,
    count: number,
    documents: DocumentsType
  ) {
    const usedWords = [currentWord]
    for (let i = 0; i < 3; i++) {
      let rand: number
      do {
        rand = Math.floor(Math.random() * count)
      } while (usedWords.includes(rand))
      usedWords.push(rand)

      const { word, article } = documents[rand]
      if (!isArticle(article)) {
        return
      }

      answerOptions.push({
        article,
        word,
        correct: false,
        pressed: false,
        selected: false,
        addOpacity: false
      })
    }
  }

  buildAnswerOptions(documents: DocumentsType, currentWord: number, count?: number): SingleChoiceListItemType[] {
    const { word, article } = documents[currentWord] || {}
    if (!word || !isArticle(article) || count === 0 || count === undefined) {
      return []
    }
    const answerOptions: SingleChoiceListItemType[] = []
    this.generateFalseAnswers(answerOptions, currentWord, count, documents)

    const positionOfCorrectAnswer = Math.floor(Math.random() * 4)
    answerOptions.splice(positionOfCorrectAnswer, 0, {
      article,
      word,
      correct: false,
      pressed: false,
      selected: false,
      addOpacity: false
    })
    return answerOptions
  }
}

export default WordChoiceExerciseService
