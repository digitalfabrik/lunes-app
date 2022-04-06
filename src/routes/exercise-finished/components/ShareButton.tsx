import React, { ReactElement } from 'react'
import { Share } from 'react-native'

import { ShareIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { DocumentResult } from '../../../navigation/NavigationTypes'

interface Props {
  disciplineTitle: string
  results: DocumentResult[]
}

const ShareButton = ({ disciplineTitle, results }: Props): ReactElement => {
  const share = async () => {
    const correctWords = results.filter(doc => doc.result === 'correct').length
    const xOfAllWords = `${correctWords} ${labels.results.of} ${results.length}`
    const message = `${labels.results.share.message1} '${disciplineTitle}' ${labels.results.share.message2} ${xOfAllWords} ${labels.results.share.message3}`

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
