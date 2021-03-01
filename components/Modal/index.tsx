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
  AsyncStorage,
} from './imports';

const ConfirmationModal = ({
  visible,
  setIsModalVisible,
  navigation,
}: IConfirmationModalProps) => {
  const closeModal = () => setIsModalVisible(false);

  const goBack = () => {
    setIsModalVisible(false);
    AsyncStorage.removeItem('session');
    navigation.goBack();
  };

  return (
    <Modal
      testID="modal"
      visible={visible}
      transparent
      animationType="fade"
      style={styles.container}>
      <View style={[styles.container, styles.overlay]}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
            <CloseIcon />
          </TouchableOpacity>
          <Text style={styles.message}>
            Do you really want to end this session?
          </Text>
          <Button onPress={closeModal} theme={BUTTONS_THEME.dark}>
            <Text style={styles.lightLabel}>continue</Text>
          </Button>

          <Button onPress={goBack} theme={BUTTONS_THEME.light}>
            <Text style={styles.darkLabel}>end</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
