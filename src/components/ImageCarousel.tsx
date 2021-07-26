import Carousel from "react-native-snap-carousel"
import {View, Text, SafeAreaView} from "react-native";
import React from "react";
import {ImagesType} from "../constants/endpoints";

export interface ImageCarouselPropsType {
    images: ImagesType
}

const ImageCarousel = (props: ImageCarouselPropsType): JSX.Element => {

    const carouselItems = [
        {
            title:"Item 1",
            text: "Text 1",
        },
        {
            title:"Item 2",
            text: "Text 2",
        },
        {
            title:"Item 3",
            text: "Text 3",
        },
        {
            title:"Item 4",
            text: "Text 4",
        },
        {
            title:"Item 5",
            text: "Text 5",
        },
    ]

    const renderItem = ({item, index}: any) => {
        return (
            <View style={{
                backgroundColor:'floralwhite',
                borderRadius: 5,
                height: 250,
                padding: 50,
                marginLeft: 25,
                marginRight: 25, }}>
                <Text style={{fontSize: 30}}>{item.title}</Text>
                <Text>{item.text}</Text>
            </View>

        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'rebeccapurple', paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                    layout={"default"}
                    data={carouselItems}
                    sliderWidth={300}
                    itemWidth={300}
                    renderItem={renderItem}
                     />
            </View>
        </SafeAreaView>
        )

}

export default ImageCarousel