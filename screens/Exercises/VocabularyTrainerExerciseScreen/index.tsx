import {
  React,
  useState,
  Modal,
  View,
  ProgressBar,
  COLORS,
  styles,
  Image,
  Text,
  IDocumentProps,
  ENDPOINTS,
  axios,
  IVocabularyTrainerScreen,
  AnswerSection,
  BackHandler,
  KeyboardAwareScrollView,
  ActivityIndicator,
  TouchableOpacity,
  CloseButton,
  SCREENS,
  useFocusEffect,
  AsyncStorage,
} from './imports';

const VocabularyTrainerExerciseScreen = ({
  navigation,
  route,
}: IVocabularyTrainerScreen) => {
  // AsyncStorage.removeItem('session')
  // return <View></View>
  const {extraParams, retryData} = route.params;
  const {trainingSet, trainingSetId, profession} = extraParams;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [documents, setDocuments] = useState<IDocumentProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentDocumentNumber(0);
      const getDocuments = async () => {
        try {
          const documentsRes = retryData?.data?.length
            ? retryData
            : await axios.get(
                ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`),
              );
          setDocuments(documentsRes.data);
          setCurrentDocumentNumber(0);
        } catch (error) {
          console.error(error);
        }
      };

      getDocuments();
    }, [retryData, trainingSetId]),
  );

  React.useLayoutEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={showModal} style={styles.headerLeft}>
            <CloseButton />
            <Text style={styles.title}>End Session</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Text style={styles.headerText}>
            {`${currentDocumentNumber} of ${documents.length}`}
          </Text>
        ),
      }),
    [navigation, currentDocumentNumber, documents],
  );

  React.useLayoutEffect(() => {
    const bEvent = BackHandler.addEventListener('hardwareBackPress', showModal);

    AsyncStorage.setItem('session', JSON.stringify(route.params));

    return () => bEvent.remove();
  }, [route.params]);

  const showModal = () => {
    setIsModalVisible(true);
    return true;
  };

  const tryLater = () => {
    const currDocument = documents[currentDocumentNumber];
    let newDocuments = documents.filter((d) => d !== currDocument);
    newDocuments.push(currDocument);
    setDocuments(newDocuments);
  };

  const finishExercise = () => {
    AsyncStorage.removeItem('session');
    navigation.navigate(SCREENS.initialSummaryScreen, {extraParams});
  };

  const docsLength = documents.length;
  return (
    <View>
      <ProgressBar
        progress={docsLength > 0 ? currentDocumentNumber / docsLength : 0}
        color={COLORS.lunesGreenMedium}
        style={styles.progressBar}
        accessibilityComponentType
        accessibilityTraits
      />

      <KeyboardAwareScrollView
        scrollEnabled={false}
        resetScrollToCoords={{x: 0, y: 0}}
        enableOnAndroid
        keyboardShouldPersistTaps="always">
        <Image
          source={{
            uri: documents[currentDocumentNumber]?.image,
          }}
          style={styles.image}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && <ActivityIndicator style={styles.spinner} />}

        <AnswerSection
          currentDocumentNumber={currentDocumentNumber}
          setCurrentDocumentNumber={setCurrentDocumentNumber}
          documents={documents}
          finishExercise={finishExercise}
          tryLater={tryLater}
          subCategory={trainingSet}
          profession={profession}
        />
      </KeyboardAwareScrollView>

      <Modal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        navigation={navigation}
      />
    </View>
  );
};

export default VocabularyTrainerExerciseScreen;
