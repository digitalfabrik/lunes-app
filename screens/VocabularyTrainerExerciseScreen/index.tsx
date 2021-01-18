import {
  React,
  TouchableOpacity,
  CloseButton,
  useState,
  Modal,
  View,
  ProgressBar,
  COLORS,
  styles,
  TextInput,
  Image,
  Text,
  NextArrow,
  CloseIcon,
  VolumeUpDisabled,
} from './imports';

const VocabularyTrainerExerciseScreen = ({navigation}: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [word, setWord] = useState('');
  const [correctAnswersNumber] = useState(5);
  const [totalWordsNumber] = useState(10);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const clearTextInput = () => {
    setWord('');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackImage: () => (
        <TouchableOpacity onPress={showModal}>
          <CloseButton />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View>
          <Text
            style={
              styles.headerText
            }>{`${correctAnswersNumber} of ${totalWordsNumber}`}</Text>
        </View>
      ),
    });
  }, [navigation, correctAnswersNumber, totalWordsNumber]);

  return (
    <>
      <View>
        {/* progress value will change dynamically when implement the logic */}
        <ProgressBar
          progress={0.5}
          color={COLORS.lunesGreenMedium}
          style={styles.progressBar}
          accessibilityComponentType
          accessibilityTraits
        />

        {/* this is a placeholder image, will be changed to one from the API */}
        <Image
          source={{
            uri:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpWWrw3YJAfkwF3tECvAGyjyQ8lOgxnyat0Q&usqp=CAU',
          }}
          style={styles.image}
        />
        <TouchableOpacity style={styles.volumeIcon}>
          <VolumeUpDisabled />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Word with article"
              placeholderTextColor={COLORS.lunesBlackLight}
              value={word}
              onChangeText={(text) => setWord(text)}
            />

            {word !== '' && (
              <TouchableOpacity onPress={clearTextInput}>
                <CloseIcon />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            disabled={!word}
            style={[styles.checkEntryButton, !word && styles.disabledButton]}>
            <Text
              style={[
                styles.checkEntryLabel,
                !word && styles.disabledButtonLabel,
              ]}>
              Check entry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.giveUpButton}>
            <Text style={styles.giveUpLabel}>I give up!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tryLaterButton}>
            <Text style={styles.giveUpLabel}>Try later</Text>
            <NextArrow />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        navigation={navigation}
      />
    </>
  );
};

export default VocabularyTrainerExerciseScreen;
