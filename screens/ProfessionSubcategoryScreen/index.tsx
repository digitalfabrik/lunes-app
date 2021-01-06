import {
  React,
  styles,
  View,
  Text,
  IProfessionSubcategoryScreenProps,
  LogBox,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ProfessionSubcategoryScreen = ({
  route,
}: IProfessionSubcategoryScreenProps) => {
  const {id, title, description, Icon} = route.params;

  //This is only for test passing params with navigation, and will be replaced with profession subcategory screen in separate PR
  return (
    <View style={styles.container}>
      <Icon width={50} height={50} />
      <Text style={styles.text}>{`id: ${id}`}</Text>
      <Text style={styles.text}>{`title: ${title}`}</Text>
      <Text style={styles.text}>{`description: ${description}`}</Text>
    </View>
  );
};

export default ProfessionSubcategoryScreen;
