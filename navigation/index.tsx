import {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  ExercisesScreen,
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
      <ProfessionStack.Screen
        options={({route}: any) => ({
          headerTitle: route.params.extraParams,
          headerBackImage: () => <BackButton />,
          headerTitleStyle: styles.title,
          headerStyle: styles.header,
          headerRightContainerStyle: styles.rightHeaderComponent,
        })}
        name="Exercises"
        component={ExercisesScreen}
      />
    </ProfessionStack.Navigator>
  );
};

export default Navigation;
