import {
  React,
  Header,
  ListView,
  View,
  styles,
  Text,
  axios,
  useFocusEffect,
  useState,
  IProfessionsProps,
  ENDPOINTS,
  SCREENS,
  SafeAreaInsetsContext,
} from './imports';

const ProfessionScreen = ({navigation}: any) => {
  const [professions, setProfessions] = useState<IProfessionsProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      let isActive: boolean = true;

      const getProfessions = async () => {
        try {
          const professionsRes = await axios.get(ENDPOINTS.professions.all);

          if (isActive) {
            setProfessions(professionsRes.data);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
        }
      };

      getProfessions();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={styles.root}>
          <Header top={insets.top} />
          <ListView
            navigation={navigation}
            title={
              <>
                <Text style={styles.text}>Welcome to Lunes!</Text>
                <Text style={styles.text}>
                  Learn German vocabulary for your profession.
                </Text>
              </>
            }
            listData={professions}
            nextScreen={SCREENS.professionSubcategory}
            isLoading={isLoading}
            from={SCREENS.profession}
          />
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
};

export default ProfessionScreen;
