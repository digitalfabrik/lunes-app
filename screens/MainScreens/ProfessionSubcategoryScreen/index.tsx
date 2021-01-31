import {
  React,
  styles,
  View,
  Text,
  IProfessionSubcategoryScreenProps,
  LogBox,
  ListView,
  SCREENS,
  ENDPOINTS,
  axios,
  IProfessionSubcategoryProps,
  useState,
  useFocusEffect,
  getProfessionSubcategoryWithIcon,
  StatusBar,
  COLORS,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ProfessionSubcategoryScreen = ({
  route,
  navigation,
}: IProfessionSubcategoryScreenProps) => {
  const {id, title, icon} = route.params;
  const [professionSubcategories, setProfessionSubcategories] = useState<
    IProfessionSubcategoryProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);

      const getProfessionSubcategories = async () => {
        try {
          const professionSubcategoriesRes = await axios.get(
            ENDPOINTS.subCategories.all.replace(':id', `${id}`),
          );

          setProfessionSubcategories(
            getProfessionSubcategoryWithIcon(
              icon,
              professionSubcategoriesRes.data,
            ),
          );

          setCount(professionSubcategoriesRes.data.length);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };

      getProfessionSubcategories();
    }, [id, icon]),
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.blue} barStyle="dark-content" />

      <ListView
        navigation={navigation}
        title={
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
              {count} {count === 1 ? 'Kategory' : 'Kategories'}
            </Text>
          </>
        }
        listData={professionSubcategories}
        nextScreen={SCREENS.exercises}
        extraParams={title}
        isLoading={isLoading}
        from={SCREENS.professionSubcategory}
      />
    </View>
  );
};

export default ProfessionSubcategoryScreen;
