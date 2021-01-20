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
  Image,
  Text,
  IDocumentProps,
  useFocusEffect,
  ENDPOINTS,
  axios,
  IVocabularyTrainerScreen,
  AnswerSection,
} from './imports';

const VocabularyTrainerExerciseScreen = ({
  navigation,
  route,
}: IVocabularyTrainerScreen) => {
  const {extraParams} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
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

        <AnswerSection
          count={count}
          index={index}
          setIndex={setIndex}
          currentWordNumber={currentWordNumber}
          setCurrentWordNumber={setCurrentWordNumber}
        />
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
