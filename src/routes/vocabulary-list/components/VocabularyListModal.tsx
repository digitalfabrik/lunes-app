import React, { ReactElement } from 'react'
import { Modal, SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconWhite, ArrowRightIcon } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import Button from '../../../components/Button'
import ImageCarousel from '../../../components/ImageCarousel'
import SingleChoiceListItem from '../../../components/SingleChoiceListItem'
import { BUTTONS_THEME } from '../../../constants/data'
import { Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'

const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
  width: 100%;
`

const ModalHeader = styled.View`
  display: flex;
  align-items: flex-end;
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
  isModalVisible: boolean
  setIsModalVisible: (isModalVisible: boolean) => void
  selectedDocumentIndex: number
  setSelectedDocumentIndex: (selectedDocumentIndex: number) => void
}

const VocabularyListModal = ({
  documents,
  isModalVisible,
  setIsModalVisible,
  selectedDocumentIndex,
  setSelectedDocumentIndex
}: VocabularyListModalProps): ReactElement => {
  const goToNextWord = (): void => {
    if (selectedDocumentIndex + 1 < documents.length) {
      setSelectedDocumentIndex(selectedDocumentIndex + 1)
    }
  }

  return (
    <Modal animationType='slide' transparent visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
      <SafeAreaView>
        <ModalContainer>
          <ModalHeader>
            <CloseCircleIconWhite onPress={() => setIsModalVisible(false)} width={wp('7%')} height={wp('7%')} />
          </ModalHeader>
          <ImageCarousel images={documents[selectedDocumentIndex].document_image} />
          <AudioPlayer document={documents[selectedDocumentIndex]} disabled={false} />
          <ItemContainer>
            <SingleChoiceListItem
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
        </ModalContainer>
      </SafeAreaView>
    </Modal>
  )
}

export default VocabularyListModal
