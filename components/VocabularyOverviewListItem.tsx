import React from 'react';
import {IVocabularyOverviewListItemProps} from '../interfaces/exercise';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import {COLORS} from '../constants/colors';
import {ARTICLES} from '../constants/data';
import Tts from 'react-native-tts';
import {getArticleColor} from '../utils/helpers';
import SoundPlayer from 'react-native-sound-player';
import {VolumeUp} from '../assets/images';
import {capitalizeFirstLetter} from '../utils/helpers';
import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  container: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 15,
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: 50,
  },
  title: {
    fontSize: wp('3.5%'),
    fontWeight: 'normal',
    borderRadius: 10,
    marginBottom: 6,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular',
    alignSelf: 'flex-start',
    width: wp('10%'),
    overflow: 'hidden',
    height: wp('5%'),
    textAlign: 'center',
    lineHeight: 18,
  },
  description: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
    marginLeft: 8,
  },
  speaker: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 3,
    shadowOpacity: 10,
  },
});

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
      Tts.speak(`${article} ${word}`, {
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
