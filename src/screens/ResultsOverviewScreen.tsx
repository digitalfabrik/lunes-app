import React from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Title from '../components/Title';
import {Arrow, RepeatIcon, FinishIcon} from '../../assets/images';
import {
  RESULTS,
  BUTTONS_THEME,
  SCREENS,
  RESULT_TYPE,
  EXERCISES,
} from '../constants/data';
import {IResultsOverviewScreenProps} from '../interfaces/summaryScreens';
import {useFocusEffect} from '@react-navigation/native';
import Button from '../components/Button';
import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  list: {
    flexGrow: 0,
    width: '100%',
    marginBottom: hp('6%'),
  },
  screenDescription: {
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
    lineHeight: 18,
    marginTop: 7,
  },
  description: {
    fontSize: wp('4%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular',
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    paddingBottom: hp('3%'),
  },
  screenSubTitle: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  container: {
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
  },
  clickedContainer: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.lunesBlack,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
  },
  clickedItemTitle: {
    textAlign: 'left',
    fontSize: wp('5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  clickedItemDescription: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.white,
    fontFamily: 'SourceSansPro-Regular',
  },
  title2: {
    textAlign: 'left',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  level: {
    marginTop: hp('1%'),
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  lightLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesWhite,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  headerText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesBlack,
    textTransform: 'uppercase',
    marginRight: 8,
  },
  rightHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    shadowOpacity: 0,
    elevation: 0,
    borderBottomColor: COLORS.lunesBlackUltralight,
    borderBottomWidth: 1,
  },
  footer: {
    marginTop: 25,
    alignItems: 'center',
  },
});

const ResultsOverview = ({navigation, route}: IResultsOverviewScreenProps) => {
  const {extraParams, results} = route.params;
  const {exercise} = extraParams;
  const {Level, description, title} = EXERCISES.filter(
    ({title}) => title === exercise,
  )[0];
  const [selectedId, setSelectedId] = React.useState(-1);
  const [counts, setCounts] = React.useState({});

  useFocusEffect(React.useCallback(() => setSelectedId(-1), []));
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.rightHeader}
          onPress={() => navigation.navigate(SCREENS.exercises, {extraParams})}>
          <Text style={styles.headerText}>Finish Exercise</Text>
          <FinishIcon />
        </TouchableOpacity>
      ),
      headerStyle: styles.header,
    });

    setCounts({
      total: results.length,
      correct: results.filter(({result}) => result === 'correct').length,
      incorrect: results.filter(({result}) => result === 'incorrect').length,
      similar: results.filter(({result}) => result === 'similar').length,
    });
  }, [results, navigation, extraParams]);

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>Results Overview</Text>
        <Text style={styles.screenSubTitle}>{title}</Text>
        <Text style={styles.screenDescription}>{description}</Text>
        <Level style={styles.level} />
      </>
    </Title>
  );

  const Item = ({item}: any) => {
    const handleNavigation = ({id}: number) => {
      setSelectedId(id);

      navigation.navigate(SCREENS.ResultScreen, {
        extraParams,
        resultType: RESULT_TYPE[id - 1],
        results,
        counts,
      });
    };

    const cID = RESULT_TYPE[item.id - 1];
    const count = counts[cID];

    const selected = item.id === selectedId;
    const iconColor = selected ? COLORS.lunesWhite : COLORS.lunesGreyDark;
    const arrowColor = selected ? COLORS.lunesRedLight : COLORS.lunesBlack;
    const itemStyle = selected ? styles.clickedContainer : styles.container;
    const itemTitleStyle = selected ? styles.clickedItemTitle : styles.title2;
    const descriptionStyle = selected
      ? styles.clickedItemDescription
      : styles.description;

    return (
      <Pressable style={itemStyle} onPress={() => handleNavigation(item)}>
        <View style={styles.leftSide}>
          <item.icon fill={iconColor} width={30} height={30} />
          <View style={styles.text}>
            <Text style={itemTitleStyle}>{item.title}</Text>
            <Text style={descriptionStyle}>
              {`${count} of ${counts.total} Words`}
            </Text>
          </View>
        </View>
        <Arrow fill={arrowColor} />
      </Pressable>
    );
  };

  const repeatExercise = () => {
    navigation.navigate(SCREENS.vocabularyTrainer, {
      retryData: {data: results},
      extraParams,
    });
  };

  const Footer = (
    <Button onPress={repeatExercise} theme={BUTTONS_THEME.dark}>
      <>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <Text style={styles.lightLabel}>Repeat whole exercise</Text>
      </>
    </Button>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={RESULTS}
        style={styles.list}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Footer}
        ListFooterComponentStyle={styles.footer}
      />
    </View>
  );
};

export default ResultsOverview;
