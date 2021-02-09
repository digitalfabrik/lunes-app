import {React, Text, IResultScreenProps} from './imports';

// Will be changed in its branch
const IncorrectResults = ({route}: IResultScreenProps) => {
  const {title} = route.params;

  return <Text>{title}</Text>;
};

export default IncorrectResults;
