import {
  React,
  Text,
  TouchableOpacity,
  View,
  styles,
  Modal,
  IConfirmationModalProps,
  CloseIcon,
} from './imports';

const ConfirmationModal = ({
  visible,
  setIsModalVisible,
  navigation,
}: IConfirmationModalProps) => {
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const goBack = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Modal visible={visible} transparent animationType="fade">
        <View style={[styles.container, styles.overlay]}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.message}>
              Do you really want to end this session?
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={closeModal}>
              <Text style={styles.continueLabel}>continue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endButton} onPress={goBack}>
              <Text style={styles.endLabel}>end</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmationModal;
