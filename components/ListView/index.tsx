import {
  React,
  styles,
  View,
  IListViewProps,
  FlatList,
  ListItem,
  ActivityIndicator,
  COLORS,
} from './imports';

const ListView = ({title, listData, navigation, isLoading}: IListViewProps) => {
  const renderItem = ({item}: any) => (
    <ListItem
      id={item.id}
      title={item.title}
      description={item.description}
      Icon={item.Icon}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.root}>
      <View style={styles.title}>{title}</View>
      {isLoading ? (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={COLORS.lunesBlack} />
        </View>
      ) : (
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ListView;
