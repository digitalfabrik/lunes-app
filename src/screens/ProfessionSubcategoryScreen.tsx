import React, {useState} from 'react';
import {View, Text, LogBox, StatusBar, FlatList} from 'react-native';
import {
  IProfessionSubcategoryScreenProps,
  IProfessionSubcategoryProps,
} from '../interfaces/professionSubcategory';
import Title from '../components/Title';
import {SCREENS} from '../constants/data';
import axios from '../utils/axios';
import {ENDPOINTS} from '../constants/endpoints';
import {getProfessionSubcategoryWithIcon} from '../utils/helpers';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../components/Loading';
import MenuItem from '../components/MenuItem';
import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingTop: 32,
  },
  itemText: {flexDirection: 'row', alignItems: 'center'},
  list: {
    width: '100%',
  },
  description: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  clickedItemDescription: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    letterSpacing: undefined,
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-Regular',
  },
  badgeLabel: {
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('3%'),
    fontWeight: '600',
    minWidth: wp('6%'),
    height: wp('4%'),
    borderRadius: 8,
    backgroundColor: COLORS.lunesGreyMedium,
    overflow: 'hidden',
    textAlign: 'center',
  },
  clickedItemBadgeLabel: {
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    minWidth: wp('6%'),
    height: wp('4%'),
    borderRadius: 8,
    backgroundColor: COLORS.lunesWhite,
    overflow: 'hidden',
    textAlign: 'center',
  },
});

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ProfessionSubcategoryScreen = ({
  route,
  navigation,
}: IProfessionSubcategoryScreenProps) => {
  const {extraParams} = route.params;

  const {disciplineID, disciplineTitle, disciplineIcon} = extraParams;
  const [subcategories, setsubcategories] = useState<
    IProfessionSubcategoryProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(-1);
  const [count, setCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const url = ENDPOINTS.subCategories.all.replace(':id', disciplineID);
      axios.get(url).then((response) => {
        setsubcategories(
          getProfessionSubcategoryWithIcon(disciplineIcon, response.data),
        );

        setCount(response.data.length);
        setIsLoading(false);
      });
      setSelectedId(-1);
    }, [disciplineIcon, disciplineID]),
  );

  const titleCOMP = (
    <Title>
      <>
        <Text style={styles.screenTitle}>{disciplineTitle}</Text>
        <Text style={styles.description}>
          {count} {count === 1 ? 'Kategory' : 'Kategories'}
        </Text>
      </>
    </Title>
  );

  const Item = ({item}: any) => {
    const selected = item.id === selectedId;
    const descriptionStyle = selected
      ? styles.clickedItemDescription
      : styles.description;

    const badgeStyle = selected
      ? styles.clickedItemBadgeLabel
      : styles.badgeLabel;

    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <View style={styles.itemText}>
          <Text style={badgeStyle}>{item.total_documents}</Text>
          <Text style={descriptionStyle}>
            {item.total_documents === 1 ? ' Lektion' : ' Lektionen'}
          </Text>
        </View>
      </MenuItem>
    );
  };

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);
    navigation.navigate(SCREENS.exercises, {
      extraParams: {
        ...extraParams,
        trainingSetId: item.id,
        trainingSet: item.title,
      },
    });
  };
  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
      <Loading isLoading={isLoading}>
        <FlatList
          data={subcategories}
          style={styles.list}
          ListHeaderComponent={titleCOMP}
          renderItem={Item}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
    </View>
  );
};

export default ProfessionSubcategoryScreen;
