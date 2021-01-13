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
  const {id, title, description, Icon} = route.params;
  const [professionSubcategories, setProfessionSubcategories] = useState<
    IProfessionSubcategoryProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

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
                Icon,
                professionSubcategoriesRes.data,
              ),
            );
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
    }, [id, Icon]),
  );

  return (
    <View style={styles.root}>
      <ListView
        navigation={navigation}
        title={
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </>
        }
        listData={professionSubcategories}
        nextScreen={SCREENS.exercises}
        extraParams={title}
        isLoading={isLoading}
      />
    </View>
  );
};

export default ProfessionSubcategoryScreen;
