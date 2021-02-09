import {
  React,
  Text,
  IResultScreenProps,
  CircularFinishIcon,
  SCREENS,
  TouchableOpacity,
} from './imports';

const CorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {title} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.exercises)}>
          <CircularFinishIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return <Text>{title}</Text>;
};

export default CorrectResults;
