import React, {useLayoutEffect, useState} from 'react';
import Modal from "./Modal";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {CloseButton} from "../../assets/images";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {COLORS} from "../constants/colors";
import labels from "../constants/labels.json"

const HeaderStyle = StyleSheet.create({
    headerText: {
        fontSize: wp('4%'),
        fontWeight: 'normal',
        fontFamily: 'SourceSansPro-Regular',
        color: COLORS.lunesGreyMedium
    },
    title: {
        color: COLORS.lunesBlack,
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: wp('4%'),
        textTransform: 'uppercase',
        fontWeight: '600',
        marginLeft: 15
    },
    headerLeft: {
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100
    }
})

interface ExerciseHeaderPropsType {
    navigation: any
    extraParams: any
    currentWord: number
    numberOfWords: number
}

function ExerciseHeader({navigation, extraParams, currentWord, numberOfWords}: ExerciseHeaderPropsType) {
    const [isModalVisible, setIsModalVisible] = useState(false)

    useLayoutEffect(() =>
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity onPress={() => setIsModalVisible(true)} style={HeaderStyle.headerLeft}>
                        <CloseButton/>
                        <Text style={HeaderStyle.title}>{labels.general.header.cancelExercise}</Text>
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <Text style={HeaderStyle.headerText}>{`${currentWord + 1} ${labels.general.header.of} ${numberOfWords}`}</Text>
                )
            }),
        [navigation, currentWord, numberOfWords, setIsModalVisible])


    return (
        <Modal
            visible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            navigation={navigation}
            extraParams={extraParams}
        />
    );
}

export default ExerciseHeader;