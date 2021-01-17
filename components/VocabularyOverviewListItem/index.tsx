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
} from './imports';

//German language
Tts.setDefaultLanguage('de-DE');

const VocabularyOverviewListItem = ({
  image,
  article,
  word,
}: IVocabularyOverviewListItemProps) => {
  const handlaSpeakerClick = () => {
    Tts.speak(word, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

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
            <Text style={styles.title}>{article}</Text>
          </View>
          <Text style={styles.description}>{word}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.speaker} onPress={handlaSpeakerClick}>
        <VolumeUp />
      </TouchableOpacity>
    </View>
  );
};

export default VocabularyOverviewListItem;
