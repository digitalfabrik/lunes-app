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

  const titleCOMP = (
    <Title>
      <Text style={styles.screenTitle}>{subCategory}</Text>
      <Text style={styles.screenDescription}>2 Exercises</Text>
    </Title>
  );

  const Item = ({item}: any) => {
    const selected = item.id === selectedId;
    const itemStyle = selected ? styles.clickedContainer : styles.container;
    const itemTitleStyle = selected ? styles.clickedItemTitle : styles.title2;
    const descriptionStyle = selected
      ? styles.clickedItemDescription
      : styles.description;

    return (
      <Pressable style={itemStyle} onPress={() => handleNavigation(item)}>
        <View>
          <Text style={itemTitleStyle}>{item.title}</Text>
          <Text style={descriptionStyle}>{item.description}</Text>
          <item.Level style={styles.level} />
        </View>
        <Arrow
          fill={
            item.id === selectedId ? COLORS.lunesRedLight : COLORS.lunesBlack
          }
        />
      </Pressable>
    );
  };

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
