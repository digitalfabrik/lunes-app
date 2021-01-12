import {
  React,
  styles,
  View,
  IListViewProps,
  FlatList,
  ListItem,
} from './imports';

const ListView = ({
  title,
  listData,
  navigation,
  nextScreen,
  extraParams,
}: IListViewProps) => {
  const renderItem = ({item}: any) => (
    <ListItem
      id={item.id}
      title={item.title}
      description={item.description}
      Icon={item.Icon}
      navigation={navigation}
      nextScreen={nextScreen ? nextScreen : item.nextScreen}
      extraParams={extraParams}
      Level={item.Level}
    />
  );

  return (
    <View style={styles.root}>
      <View style={styles.title}>{title}</View>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
};

export default ListView;
