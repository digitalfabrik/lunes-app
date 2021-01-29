import {React, styles, View, ActivityIndicator, COLORS} from './imports';

const Loading = ({children, isLoading}: any) => {
  return (
    <View style={styles.root}>
      {isLoading ? (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={COLORS.lunesBlack} />
        </View>
      ) : (
        children
      )}
    </View>
  );
};

export default Loading;
