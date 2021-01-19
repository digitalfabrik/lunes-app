import {
  React,
  styles,
  IVocabularyOverviewListItemProps,
  View,
  Text,
  Image,
  TouchableOpacity,
  Tts,
  getArticleColor,
  VolumeUp,
  SoundPlayer,
  InActiveVolumeUp,
} from './imports';

//German language
Tts.setDefaultLanguage('de-DE');

const VocabularyOverviewListItem = ({
  image,
  article,
  word,
  audio,
}: IVocabularyOverviewListItemProps) => {
  const [active, setActive] = React.useState(false);

  const handlaSpeakerClick = (audio: string) => {
    setActive(true);

    if (audio) {
      //audio from API
      SoundPlayer.playUrl(audio);
    } else {
      Tts.speak(word, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  };

  React.useEffect(() => {
    SoundPlayer.addEventListener('FinishedPlaying', () => {
      setActive(false);
    });

    Tts.addEventListener('tts-finish', () => setActive(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Image
          source={{
            uri: image,
          }}
          width={24}
          height={24}
          style={styles.image}
        />
        <View>
          <View
            style={[styles.badge, {backgroundColor: getArticleColor(article)}]}>
            <Text style={styles.title}>
              {article.toLowerCase() == 'die (plural)' ? 'die' : article}
            </Text>
          </View>
          <Text style={styles.description}>{word}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.speaker}
        onPress={() => handlaSpeakerClick(audio)}>
        {active ? <VolumeUp /> : <InActiveVolumeUp width={32} height={32} />}
      </TouchableOpacity>
    </View>
  );
};

export default VocabularyOverviewListItem;
