import React, { ReactElement } from 'react'
import { Share } from 'react-native'

import { ShareIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { DocumentResult } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'

interface ShareButtonProps {
  disciplineTitle: string
  results: DocumentResult[]
}

const ShareButton = ({ disciplineTitle, results }: ShareButtonProps): ReactElement => {
  const share = async () => {
    const correctWords = results.filter(doc => doc.result === 'correct').length
    const xOfAllWords = `${correctWords} ${getLabels().results.of} ${results.length}`
    const message = `${getLabels().results.share.message1} '${disciplineTitle}' ${
      getLabels().results.share.message2
    } ${xOfAllWords} ${getLabels().results.share.message3}`

    await Share.share({ message })
  }

  return (
    <Button
      onPress={share}
      label={getLabels().results.share.button}
      buttonTheme={BUTTONS_THEME.outlined}
      iconRight={ShareIcon}
    />
  )
}

export default ShareButton
