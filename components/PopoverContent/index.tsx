import {Text, React, styles, View, InfoIcon} from './imports';

const PopoverContent = () => {
  return (
    <View style={styles.container}>
      <InfoIcon />
      <Text style={styles.message}>
        Ups, you forgot someting. You have to add an article to continue.
      </Text>
    </View>
  );
};

export default PopoverContent;
