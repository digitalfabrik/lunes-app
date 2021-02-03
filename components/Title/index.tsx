import {React, styles, View} from './imports';

const Title = (props: any) => (
  <View style={styles.title}>{props.children}</View>
);

export default Title;
