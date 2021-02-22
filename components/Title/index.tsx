import {ITitle} from '../../interfaces/title';
import {React, styles, View} from './imports';

const Title = (props: ITitle) => (
  <View style={styles.title}>{props.children}</View>
);

export default Title;
