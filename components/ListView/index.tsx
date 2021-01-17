import {
  React,
  styles,
  View,
  IListViewProps,
  FlatList,
  ListItem,
  ActivityIndicator,
  COLORS,
  VocabularyOverviewListItem,
} from './imports';

const ListView = ({
  title,
  listData,
  navigation,
  nextScreen,
  extraParams,
  isLoading,
  fromExercises,
}: IListViewProps) => {
  const renderItem = ({item}: any) =>
    fromExercises ? (
      <VocabularyOverviewListItem
        id={item.id}
        word={item.word}
        article={item.article}
        image={item.image}
        audio={item.audio}
      />
    ) : (
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
