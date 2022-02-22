import React, { ReactElement } from 'react'
import { Share } from 'react-native'

import { ShareIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { DocumentResult } from '../../../navigation/NavigationTypes'

interface Props {
  discipline: Discipline
  results: DocumentResult[]
}

const ShareButton = ({ discipline, results }: Props): ReactElement => {
  const share = async () => {
    const correctWords = results.filter(doc => doc.result === 'correct').length
    const xOfAllWords = `${correctWords} ${labels.results.of as string} ${discipline.numberOfChildren}`
    const message = `${labels.results.share.message1 as string} '${discipline.title}' ${
      labels.results.share.message2 as string
    } ${xOfAllWords} ${labels.results.share.message3 as string}`

    await Share.share({ message })
  }

  return (
    <Button
      onPress={share}
      label={labels.results.share.button}
      buttonTheme={BUTTONS_THEME.outlined}
      iconRight={ShareIcon}
    />
  )
}

export default ShareButton
