import React, {useState} from 'react'
import {FlatList, LogBox, StatusBar, StyleSheet, Text, View} from 'react-native'
import Title from '../components/Title'
import {DisciplineType} from '../constants/endpoints'
import {RouteProp} from '@react-navigation/native'
import Loading from '../components/Loading'
import MenuItem from '../components/MenuItem'
import {COLORS} from '../constants/colors'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {RoutesParamsType} from '../navigation/NavigationTypes'
import {StackNavigationProp} from '@react-navigation/stack'
import labels from '../constants/labels.json'
import {useLoadDisciplines} from "../hooks/useLoadDisciplines";

export const styles = StyleSheet.create({
    root: {
        backgroundColor: COLORS.lunesWhite,
        height: '100%',
        paddingTop: 32
    },
    itemText: {flexDirection: 'row', alignItems: 'center'},
    list: {
        width: '100%'
    },
    description: {
        textAlign: 'center',
        fontSize: wp('4%'),
        color: COLORS.lunesGreyMedium,
        fontFamily: 'SourceSansPro-Regular',
        paddingLeft: 5
    },
    screenTitle: {
        textAlign: 'center',
        fontSize: wp('5%'),
        color: COLORS.lunesGreyDark,
        fontFamily: 'SourceSansPro-SemiBold'
    },
    clickedItemDescription: {
        fontSize: wp('4%'),
        fontWeight: 'normal',
        letterSpacing: undefined,
        color: COLORS.lunesWhite,
        fontFamily: 'SourceSansPro-Regular'
    },
    badgeLabel: {
        color: COLORS.lunesWhite,
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: wp('3%'),
        fontWeight: '600',
        minWidth: wp('6%'),
        height: wp('4%'),
        borderRadius: 8,
        backgroundColor: COLORS.lunesGreyMedium,
        overflow: 'hidden',
        textAlign: 'center'
    },
    clickedItemBadgeLabel: {
        color: COLORS.lunesGreyMedium,
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: 12,
        fontWeight: '600',
        minWidth: wp('6%'),
        height: wp('4%'),
        borderRadius: 8,
        backgroundColor: COLORS.lunesWhite,
        overflow: 'hidden',
        textAlign: 'center'
    }
})

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']) //TODO why?

interface ProfessionSubcategoryScreenPropsType {
    route: RouteProp<RoutesParamsType, 'ProfessionSubcategory'>
    navigation: StackNavigationProp<RoutesParamsType, 'ProfessionSubcategory'>
}

const ProfessionSubcategoryScreen = ({route, navigation}: ProfessionSubcategoryScreenPropsType): JSX.Element => {
    const {extraParams} = route.params
    const {item1} = extraParams // TODO rename item1

    const [selectedId, setSelectedId] = useState<number | null>(null)
    console.log(`Get Disciplines of: ${item1.title} (${item1.id})`)
    const {data: disciplines, error, loading} = useLoadDisciplines(item1)

    const titleCOMP = (
        <Title>
            <>
                <Text style={styles.screenTitle}>{item1?.title}</Text>
                <Text style={styles.description}>
                    {item1.numberOfChildren} {item1.numberOfChildren === 1 ? labels.home.unit : labels.home.units}
                </Text>
            </>
        </Title>
    )
    // TODO adjust number of children in the header if empty stuff is filtered out or create ticket for it or talk to lukas about it

    const Item = ({item}: { item: DisciplineType }): JSX.Element | null => {
        console.log(item.title)
        if (item.numberOfChildren === 0) {
            return null
        }
        const selected = item.id === selectedId
        const descriptionStyle = selected ? styles.clickedItemDescription : styles.description
        const badgeStyle = selected ? styles.clickedItemBadgeLabel : styles.badgeLabel
        const description = item1.isLeaf ?
            item.numberOfChildren === 1 ? labels.home.word : labels.home.words :
            item.numberOfChildren === 1 ? labels.home.unit : labels.home.units

        return (
            <MenuItem
                selected={item.id === selectedId}
                title={item.title}
                icon={item.icon}
                onPress={() => handleNavigation(item)}>
                <View style={styles.itemText}>
                    <Text
                        style={badgeStyle}>{item.numberOfChildren}</Text>
                    <Text
                        style={descriptionStyle}>{description}</Text>
                </View>
            </MenuItem>
        )
    }

    const handleNavigation = (selectedItem: DisciplineType): void => {
        setSelectedId(item1.id)
        if (!item1.isLeaf) {
            console.log('navigate to new professtionSubScreen')
            navigation.push('ProfessionSubcategory', {
                extraParams: {
                    item1: selectedItem
                }
            })
        } else {
            console.log('navigate to exercise')
            navigation.navigate('Exercises', {
                extraParams: {
                    disciplineID: item1.id,
                    disciplineTitle: item1.title,
                    disciplineIcon: item1.icon,
                    trainingSetId: selectedItem.id,
                    trainingSet: selectedItem.title,
                    item1: item1
                }
            })
        }
    }

    return (
        <View style={styles.root}>
            <StatusBar backgroundColor='blue' barStyle='dark-content'/>
            <Loading isLoading={loading}>
                <FlatList
                    data={disciplines}
                    style={styles.list}
                    ListHeaderComponent={titleCOMP}
                    renderItem={Item}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </Loading>
            <Text>{error}</Text>
        </View>
    )
}

export default ProfessionSubcategoryScreen
