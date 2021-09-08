import React, { ReactElement } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../../../constants/theme/colors'
import { getArticleColor } from '../../../services/helpers'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AudioPlayer from '../../../components/AudioPlayer'
import { DocumentType } from '../../../constants/endpoints'

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16
  },
  container: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    marginRight: 15,
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: 50
  },
  title: {
    fontSize: wp('3.5%'),
    fontWeight: 'normal',
    borderRadius: 10,
    marginBottom: 6,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular',
    alignSelf: 'flex-start',
    width: wp('10%'),
    overflow: 'hidden',
    height: wp('5%'),
    textAlign: 'center'
  },
  description: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
    marginLeft: 8
  },
  speaker: {
    paddingRight: 40,
    paddingTop: 17
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 3,
    shadowOpacity: 10
  }
})

export interface VocabularyListItemPropType {
  document: DocumentType
  setIsModalVisible?: () => void
}

const VocabularyListItem = ({ document, setIsModalVisible }: VocabularyListItemPropType): ReactElement => {
  const { article, word } = document

  return (
    <Pressable style={styles.wrapper} onPress={setIsModalVisible ?? (() => {})}>
      <View style={styles.container}>
        <View style={styles.item}>
          {document.document_image.length > 0 && (
            <Image
              source={{
                uri: document.document_image[0].image
              }}
              width={24}
              height={24}
              style={styles.image}
            />
          )}
          <View>
            <Text testID='article' style={[styles.title, { backgroundColor: getArticleColor(article) }]}>
              {article.value}
            </Text>
            <Text testID='word' style={styles.description}>
              {word}
            </Text>
          </View>
        </View>
        <View style={styles.speaker}>
          <AudioPlayer document={document} disabled={false} />
        </View>
      </View>
    </Pressable>
  )
}

export default VocabularyListItem
