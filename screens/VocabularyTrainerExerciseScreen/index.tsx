import {React, TouchableOpacity, CloseButton, useState, Modal} from './imports';

const VocabularyTrainerExerciseScreen = ({navigation}: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackImage: () => (
        <TouchableOpacity onPress={showModal}>
          <CloseButton />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <>
      <Modal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        navigation={navigation}
      />
    </>
  );
};

export default VocabularyTrainerExerciseScreen;
