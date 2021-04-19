import React from 'react';
import {View, Text, StatusBar} from 'react-native';
import Button from '../../components/Button';
import {CheckIcon, ListIcon, RepeatIcon} from '../../../assets/images';
import {BUTTONS_THEME, SCREENS} from '../../constants/data';
import {IInitialSummaryScreenProps} from '../../interfaces/summaryScreens';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    alignItems: 'center',
  },
  upperSection: {
    width: hp('70%'),
    height: hp('60%'),
    backgroundColor: COLORS.lunesBlack,
    borderBottomLeftRadius: hp('60%'),
    borderBottomRightRadius: hp('60%'),
    marginBottom: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    width: wp('60%'),
    marginTop: hp('5%'),
  },
  message: {
    color: COLORS.lunesWhite,
    fontSize: wp('5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
    textAlign: 'center',
  },
  lightLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesWhite,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  darkLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesBlack,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
});
const InitialSummaryScreen = ({
  navigation,
  route,
}: IInitialSummaryScreenProps) => {
  const {extraParams} = route.params;
  const {exercise, disciplineTitle, trainingSet} = extraParams;
  const [results, setResults] = React.useState([]);
  const [message, setMessage] = React.useState('');

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem(exercise).then((value) => {
        const jsonValue = value && JSON.parse(value);
        setResults(Object.values(jsonValue[disciplineTitle][trainingSet]));
      });
    }, [exercise, disciplineTitle, trainingSet]),
  );

  React.useEffect(() => {
    const correctResults = results.filter((doc) => doc.result === 'correct');
    const percentageCorrect = (correctResults.length / results.length) * 100;
    switch (true) {
      case percentageCorrect > 66:
        setMessage('Keep it up!\nYou have mastered the exercise very well.');
        break;

      case percentageCorrect > 33:
        setMessage("You're getting there.\nPlease retry!");
        break;

      case percentageCorrect < 33:
        setMessage(
          'You still have some trouble with the basics,\nplease retry! ',
        );
        break;
    }
  }, [results]);

  const checkResults = () => {
    AsyncStorage.removeItem('session');
    navigation.navigate(SCREENS.ResultsOverview, {extraParams, results});
  };

  const repeatExercise = () => {
    navigation.navigate(SCREENS.vocabularyTrainer, {
      extraParams,
      retryData: null,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.upperSection}>
        <CheckIcon />
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

      <Button theme={BUTTONS_THEME.dark} onPress={checkResults}>
        <>
          <ListIcon />
          <Text style={styles.lightLabel}>Check my results</Text>
        </>
      </Button>

      <Button theme={BUTTONS_THEME.light} onPress={repeatExercise}>
        <>
          <RepeatIcon fill={COLORS.lunesBlack} />
          <Text style={styles.darkLabel}>Repeat exercise</Text>
        </>
      </Button>
    </View>
  );
};

export default InitialSummaryScreen;
