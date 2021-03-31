import {React, styles, View, ITitleProps} from './imports';

const Title = ({children}: ITitleProps) => (
  <View style={styles.title}>{children}</View>
);

export default Title;
