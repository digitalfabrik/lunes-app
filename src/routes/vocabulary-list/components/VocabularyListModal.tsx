import React, { ReactElement, ReactNode } from 'react'
import { Modal, SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconWhite, ArrowRightIcon } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import Button from '../../../components/Button'
import FeedbackModal from '../../../components/FeedbackModal'
import ImageCarousel from '../../../components/ImageCarousel'
import WordItem from '../../../components/WordItem'
import { BUTTONS_THEME } from '../../../constants/data'
import { Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'

const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.background};
  flex: 1;
`

const ModalHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${props => props.theme.spacings.xs};
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
  margin-bottom: ${props => props.theme.spacings.xs};
`

const ItemContainer = styled.View`
  margin: ${props => props.theme.spacings.xl} 0;
  height: 10%;
  width: 85%;
  align-self: center;
`

const ButtonContainer = styled.View`
  display: flex;
  align-self: center;
`

interface VocabularyListModalProps {
  documents: Document[]
  kebabMenu: ReactNode
  isModalVisible: boolean
  isFeedbackModalVisible: boolean
  setIsModalVisible: (isModalVisible: boolean) => void
  setIsFeedbackModalVisible: (isFeedbackModalVisible: boolean) => void
  selectedDocumentIndex: number
  setSelectedDocumentIndex: (selectedDocumentIndex: number) => void
}

const VocabularyListModal = ({
  documents,
  isModalVisible,
  setIsModalVisible,
  selectedDocumentIndex,
  setSelectedDocumentIndex,
  setIsFeedbackModalVisible,
  isFeedbackModalVisible,
  kebabMenu
}: VocabularyListModalProps): ReactElement => {
  const goToNextWord = (): void => {
    if (selectedDocumentIndex + 1 < documents.length) {
      setSelectedDocumentIndex(selectedDocumentIndex + 1)
    }
  }

  return (
    <Modal animationType='slide' transparent visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
      <ModalContainer>
        <SafeAreaView>
          <ModalHeader>
            <CloseCircleIconWhite onPress={() => setIsModalVisible(false)} width={wp('7%')} height={wp('7%')} />
            {kebabMenu}
          </ModalHeader>
          <ImageCarousel images={documents[selectedDocumentIndex].document_image} />
          <AudioPlayer document={documents[selectedDocumentIndex]} disabled={false} />
          <ItemContainer>
            <WordItem
              answer={{
                word: documents[selectedDocumentIndex].word,
                article: documents[selectedDocumentIndex].article
              }}
            />
          </ItemContainer>
          <ButtonContainer>
            {documents.length > selectedDocumentIndex + 1 ? (
              <Button
                label={labels.exercises.next}
                iconRight={ArrowRightIcon}
                onPress={goToNextWord}
                buttonTheme={BUTTONS_THEME.contained}
              />
            ) : (
              <Button
                label={labels.general.header.cancelExercise}
                onPress={() => setIsModalVisible(false)}
                buttonTheme={BUTTONS_THEME.contained}
              />
            )}
          </ButtonContainer>
        </SafeAreaView>
      </ModalContainer>
      <FeedbackModal visible={isFeedbackModalVisible} setVisible={setIsFeedbackModalVisible} />
    </Modal>
  )
}

export default VocabularyListModal
