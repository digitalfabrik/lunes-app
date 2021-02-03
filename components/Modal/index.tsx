import {
  React,
  Text,
  TouchableOpacity,
  View,
  styles,
  Modal,
  IConfirmationModalProps,
  CloseIcon,
  Button,
  BUTTONS_THEME,
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
            <Button onPress={closeModal} theme={BUTTONS_THEME.dark}>
              <Text style={styles.continueLabel}>continue</Text>
            </Button>

            <Button onPress={goBack} theme={BUTTONS_THEME.light}>
              <Text style={styles.endLabel}>end</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmationModal;
