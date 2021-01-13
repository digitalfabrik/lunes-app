import {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  BackButton,
  styles,
  ProfessionParamList,
} from './imports';

const ProfessionStack = createStackNavigator<ProfessionParamList>();

const Navigation = () => {
  return (
    <ProfessionStack.Navigator initialRouteName="Profession">
      <ProfessionStack.Screen
        options={{headerShown: false}}
        name="Profession"
        component={ProfessionScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerTitle: 'Profession Overview',
          headerBackImage: () => <BackButton />,
          headerTitleStyle: styles.title,
          headerStyle: styles.header,
        }}
        name="ProfessionSubcategory"
        component={ProfessionSubcategoryScreen}
      />
    </ProfessionStack.Navigator>
  );
};

export default Navigation;
