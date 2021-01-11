import {
  React,
  styles,
  View,
  Text,
  IProfessionSubcategoryScreenProps,
  LogBox,
  ListView,
  SCREENS,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ProfessionSubcategoryScreen = ({
  route,
  navigation,
}: IProfessionSubcategoryScreenProps) => {
  const {title, description, Icon} = route.params;

  //Need to be replaced with data from API
  const DATA = [
    {
      id: 1,
      title: 'test1',
      description: 'test',
      Icon: Icon,
    },
    {
      id: 2,
      title: 'test2',
      description: 'test',
      Icon: Icon,
    },
    {
      id: 3,
      title: 'test3',
      description: 'test',
      Icon: Icon,
    },
    {
      id: 4,
      title: 'test4',
      description: 'test',
      Icon: Icon,
    },
    {
      id: 5,
      title: 'test5',
      description: 'test',
      Icon: Icon,
    },
    {
      id: 6,
      title: 'test6',
      description: 'test',
      Icon: Icon,
    },
  ];

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
        listData={DATA}
        nextScreen={SCREENS.excercise}
        extraParams={title}
      />
    </View>
  );
};

export default ProfessionSubcategoryScreen;
