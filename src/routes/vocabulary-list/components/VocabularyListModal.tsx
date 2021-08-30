import React, { ReactElement } from 'react'
import { CloseButton, WhiteNextArrow } from '../../../../assets/images'
import ImageCarousel from '../../../components/ImageCarousel'
import AudioPlayer from '../../../components/AudioPlayer'
import SingleChoiceListItem from '../../choice-exercises/components/SingleChoiceListItem'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { Modal, SafeAreaView } from 'react-native'
import { DocumentsType } from '../../../constants/endpoints'
import styled from 'styled-components/native'
import { COLORS } from '../../../constants/colors'

const ModalContainer = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  width: 100%;
`

const ModalHeader = styled.View`
  display: flex;
  align-items: flex-end;
  padding: 10px;
  border-bottom-color: ${COLORS.lunesBlackUltralight};
  border-bottom-width: 1px;
`

const ImageCarouselContainer = styled.View`
  padding-top: 15px;
`

const ItemContainer = styled.View`
  padding: 5%;
  height: 45%;
`

const ButtonContainer = styled.View`
  display: flex;
  align-items: center;
  margin-top: -40%;
`

const ButtonText = styled.Text`
  color: ${COLORS.lunesWhite};
  font-weight: 600;
  margin-left: 10px;
  text-transform: uppercase;
`

interface VocabularyListModalPropsType {
  documents: DocumentsType
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
}: VocabularyListModalPropsType): ReactElement => {
  const goToNextWord = (): void => {
    if (documents && selectedDocumentIndex + 1 < documents.length) {
      setSelectedDocumentIndex(selectedDocumentIndex + 1)
    }
  }

  return (
    <Modal animationType='slide' transparent={true} visible={isModalVisible}>
      <SafeAreaView>
        <ModalContainer>
          <ModalHeader>
            <CloseButton onPress={() => setIsModalVisible(false)} />
          </ModalHeader>
          <ImageCarouselContainer>
            <ImageCarousel images={documents[selectedDocumentIndex].document_image} />
          </ImageCarouselContainer>
          <AudioPlayer document={documents[selectedDocumentIndex]} disabled={false} />
          <ItemContainer>
            <SingleChoiceListItem
              answer={{
                word: documents[selectedDocumentIndex].word,
                article: documents[selectedDocumentIndex].article
              }}
              onClick={() => {}}
              correct={false}
              selected={false}
              anyAnswerSelected={false}
              delayPassed={false}
              disabled={true}
            />
          </ItemContainer>
          <ButtonContainer>
            {documents.length > selectedDocumentIndex + 1 ? (
              <Button onPress={goToNextWord} theme={BUTTONS_THEME.dark}>
                <>
                  <ButtonText>{labels.exercises.next}</ButtonText>
                  <WhiteNextArrow />
                </>
              </Button>
            ) : (
              <Button onPress={() => setIsModalVisible(false)} theme={BUTTONS_THEME.dark}>
                <>
                  <ButtonText>{labels.general.header.cancelExercise}</ButtonText>
                </>
              </Button>
            )}
          </ButtonContainer>
        </ModalContainer>
      </SafeAreaView>
    </Modal>
  )
}

export default VocabularyListModal
