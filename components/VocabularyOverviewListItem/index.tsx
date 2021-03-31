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
  Platform,
  COLORS,
  ARTICLES,
  capitalizeFirstLetter,
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
  React.useEffect(() => {
    const _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => setActive(false),
    );

    const _onTtsFinishPlaying = Tts.addEventListener('tts-finish', () =>
      setActive(false),
    );

    return () => {
      _onSoundPlayerFinishPlaying.remove();
      _onTtsFinishPlaying.remove();
    };
  }, []);

  const handleSpeakerClick = () => {
    setActive(true);

    // Don't use soundplayer for IOS, since IOS doesn't support .ogg files
    if (audio && Platform.OS !== 'ios') {
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

  const volumeIconColor = active ? COLORS.lunesRed : COLORS.lunesRedDark;

  const volumeIconStyle = [styles.speaker, !active && styles.shadow];

  return (
    <View style={styles.wrapper}>
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
            <Text
              testID="article"
              style={[
                styles.title,
                {backgroundColor: getArticleColor(article)},
              ]}>
              {article?.toLowerCase() === ARTICLES.diePlural
                ? 'Die'
                : capitalizeFirstLetter(article)}
            </Text>
            <Text testID="word" style={styles.description}>
              {word}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          testID="volume-button"
          style={volumeIconStyle}
          onPress={() => handleSpeakerClick()}>
          <VolumeUp fill={volumeIconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VocabularyOverviewListItem;
