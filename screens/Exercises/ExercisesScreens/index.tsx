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
  SCREENS,
  BackButton,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ExercisesScreen = ({route, navigation}: IExercisesScreenProps) => {
  const {extraParams} = route.params;
  const {trainingSet} = extraParams;
  const [selectedId, setSelectedId] = useState(-1);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedId(-1);

      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.profession)}>
            <Home />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(SCREENS.professionSubcategory, {extraParams})
            }
            style={styles.headerLeft}>
            <BackButton />
            <Text style={styles.title}>Exercise Overview</Text>
          </TouchableOpacity>
        ),
      });
    }, [extraParams, navigation]),
  );

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>{trainingSet}</Text>
        <Text style={styles.screenDescription}>2 Exercises</Text>
      </>
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
        ...extraParams,
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
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ExercisesScreen;
