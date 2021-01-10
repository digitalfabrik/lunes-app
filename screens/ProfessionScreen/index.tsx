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
  getProfessionsIcons,
  ICONS,
  ENDPOINTS,
} from './imports';

const ProfessionScreen = ({navigation}: any) => {
  const [professions, setProfessions] = useState<IProfessionsProps[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive: boolean = true;

      const getProfessions = async () => {
        try {
          const professions = await axios.get(ENDPOINTS.professions.all);

          if (isActive) {
            setProfessions(getProfessionsIcons(ICONS, professions.data));
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
    <View style={styles.root}>
      <Header />
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
      />
    </View>
  );
};

export default ProfessionScreen;
