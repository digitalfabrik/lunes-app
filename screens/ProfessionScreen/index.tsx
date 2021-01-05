import {React, Header, ListView, View, styles, Text} from './imports';

//Needs to be replaced with icons from API
import icon1 from '../../assets/images/icon-sign-6.svg';
import icon2 from '../../assets/images/icon-sign-4.svg';
import icon3 from '../../assets/images/icon-sign-3.svg';
import icon4 from '../../assets/images/icon-sign-2.svg';
import icon5 from '../../assets/images/icon-sign-5.svg';

//Needs to be replaced with data from API
const DATA = [
  {
    id: '1',
    Icon: icon1,
    title: 'Basic',
    description: '8 Bereiche',
  },
  {
    id: '2',
    Icon: icon2,
    title: 'Construction Site',
    description: '10 Bereiche',
  },
  {
    id: '3',
    Icon: icon3,
    title: 'Electronics',
    description: '6 Bereiche',
  },
  {
    id: '4',
    Icon: icon4,
    title: 'Gastronomy',
    description: '10 Bereiche',
  },
  {
    id: '5',
    Icon: icon2,
    title: 'Metal',
    description: '5 Bereiche',
  },
  {
    id: '6',
    Icon: icon5,
    title: 'Care',
    description: '12 Bereiche',
  },
];

const ProfessionScreen = () => {
  return (
    <View style={styles.root}>
      <Header />
      <ListView
        title={
          <>
            <Text style={styles.text}>Welcome to Lunes!</Text>
            <Text style={styles.text}>
              Learn German vocabulary for your profession.
            </Text>
          </>
        }
        listData={DATA}
      />
    </View>
  );
};

export default ProfessionScreen;
