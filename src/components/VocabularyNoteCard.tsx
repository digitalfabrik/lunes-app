import styled from 'styled-components/native'

import PressableOpacity from './PressableOpacity'

const VocabularyNoteCard = styled(PressableOpacity)`
  flex-direction: column;
  background-color: ${props => props.theme.colors.backgroundAccent};
  border-radius: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm};
`

export default VocabularyNoteCard
