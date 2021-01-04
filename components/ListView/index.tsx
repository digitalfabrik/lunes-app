import {React, ScrollView, styles, Text, View} from './imports';

const ListView = () => {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.welcome}>
        <Text style={styles.text}>Welcome to Lunes!</Text>
        <Text style={styles.text}>
          Learn German vocabulary for your profession.
        </Text>
      </View>
    </ScrollView>
  );
};

export default ListView;
