import {
  React,
  styles,
  View,
  Text,
  LogBox,
  IExcerciseScreenProps,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ExcerciseScreen = ({route}: IExcerciseScreenProps) => {
  const {extraParams} = route.params;

  return (
    <View style={styles.root}>
      <Text>{extraParams}</Text>
    </View>
  );
};

export default ExcerciseScreen;
