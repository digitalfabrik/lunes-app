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
  IDocumentProps,
  useFocusEffect,
  ENDPOINTS,
  axios,
  IVocabularyTrainerScreen,
} from './imports';

const VocabularyTrainerExerciseScreen = ({
  navigation,
  route,
}: IVocabularyTrainerScreen) => {
  const {extraParams} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [word, setWord] = useState('');
  const [currentWordNumber, setCurrentWordNumber] = useState(1);
  const [documents, setDocuments] = useState<IDocumentProps[]>([]);
  const [count, setCount] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [index, setIndex] = useState(0);
  const [document, setDocument] = useState<IDocumentProps>();
  const [progressStep, setProgressStep] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const clearTextInput = () => {
    setWord('');
  };

  const getNextWord = () => {
    if (index < count - 1) {
      setIndex(index + 1);
      setCurrentWordNumber(currentWordNumber + 1);
    }
  };

  React.useEffect(() => {
    setDocument(documents[index]);
    setProgressValue((prevValue) => prevValue + progressStep);
  }, [index, progressStep, documents]);

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
            }>{`${currentWordNumber} of ${count}`}</Text>
        </View>
      ),
    });
  }, [navigation, currentWordNumber, count]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive: boolean = true;

      const getProfessions = async () => {
        try {
          const documentsRes = await axios.get(
            ENDPOINTS.documents.all.replace(':id', `${extraParams}`),
          );

          if (isActive) {
            setDocuments(documentsRes.data);
            setCount(documentsRes.data.length);
            setDocument(documentsRes.data[0]);
            setProgressStep(
              documentsRes.data.length && 1 / documentsRes.data.length,
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

      getProfessions();

      return () => {
        isActive = false;
      };
    }, [extraParams]),
  );

  return (
    <>
      <View>
        <ProgressBar
          progress={progressValue}
          color={COLORS.lunesGreenMedium}
          style={styles.progressBar}
          accessibilityComponentType
          accessibilityTraits
        />

        <Image
          source={{
            uri: document?.image,
          }}
          style={styles.image}
        />

        {/* this is disabled for now, until finish implementing the logic */}
        <TouchableOpacity disabled style={styles.volumeIcon}>
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

          <TouchableOpacity style={styles.tryLaterButton} onPress={getNextWord}>
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
