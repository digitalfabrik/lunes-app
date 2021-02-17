import {
  React,
  styles,
  View,
  Text,
  LogBox,
  IExercisesScreenProps,
  TouchableOpacity,
  useFocusEffect,
  Home,
  FlatList,
  useState,
  Pressable,
  EXERCISES,
  Title,
  Arrow,
  COLORS,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ExercisesScreen = ({route, navigation}: IExercisesScreenProps) => {
  const {subCategory, profession, subCategoryID, professionID} = route.params;
  const [selectedId, setSelectedId] = useState(-1);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedId(-1);

      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.popToTop()}>
            <Home />
          </TouchableOpacity>
        ),
      });
    }, [navigation]),
  );

  const descriptionStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemDescription : styles.description;

  const itemStyle = (item: any) =>
    item.id === selectedId ? styles.clickedContainer : styles.container;

  const itemTitleStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemTitle : styles.title2;

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);
    navigation.navigate(item.nextScreen, {
      extraParams: {
        profession: profession,
        subCategory: subCategory,
        professionId: professionID,
        subCategoryId: subCategoryID,
        exercise: item.title,
        exerciseDescription: item.description,
        Level: item.Level,
      },
    });
  };

  const titleCOMP = (
    <Title>
      <Text style={styles.screenTitle}>{subCategory}</Text>
      <Text style={styles.screenDescription}>2 Exercises</Text>
    </Title>
  );

  const Item = ({item}: any) => (
    <Pressable style={itemStyle(item)} onPress={() => handleNavigation(item)}>
      <View>
        <Text style={itemTitleStyle(item)}>{item.title}</Text>
        <Text style={descriptionStyle(item)}>{item.description}</Text>
        <item.Level style={styles.level} />
      </View>
      <Arrow
        fill={item.id === selectedId ? COLORS.lunesRedLight : COLORS.lunesBlack}
      />
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={EXERCISES}
        style={styles.list}
        ListHeaderComponent={titleCOMP}
        renderItem={Item}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ExercisesScreen;
