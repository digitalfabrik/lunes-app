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
      let isActive: boolean = true;

      const getProfessionSubcategories = async () => {
        try {
          const professionSubcategoriesRes = await axios.get(
            ENDPOINTS.subCategories.all.replace(':id', `${id}`),
          );

          if (isActive) {
            setProfessionSubcategories(
              getProfessionSubcategoryWithIcon(
                icon,
                professionSubcategoriesRes.data,
              ),
            );
            setCount(professionSubcategoriesRes.data.length);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
        }
      };

      getProfessionSubcategories();

      return () => {
        isActive = false;
      };
    }, [id, icon]),
  );

  return (
    <View style={styles.root}>
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
