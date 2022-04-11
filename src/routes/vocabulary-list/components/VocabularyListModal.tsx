import React, { ReactElement } from 'react'
import { Modal, SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconWhite, ArrowRightIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import DocumentImageSection from '../../../components/DocumentImageSection'
import { BUTTONS_THEME } from '../../../constants/data'
import { Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import SingleChoiceListItem from '../../choice-exercises/components/SingleChoiceListItem'

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
  padding: ${props => props.theme.spacings.md};
  height: 45%;
`

const ButtonContainer = styled.View`
  display: flex;
  align-items: center;
  margin-top: -40%;
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
  const document = documents[selectedDocumentIndex]
  const { word, article } = document

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
          <DocumentImageSection document={document} />
          <ItemContainer>
            <SingleChoiceListItem
              answer={{ word, article }}
              onClick={() => undefined}
              correct={false}
              selected={false}
              anyAnswerSelected={false}
              delayPassed={false}
              disabled
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
