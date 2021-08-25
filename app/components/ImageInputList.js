import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ImageInput from "./ImageInput";

const ImageInputList = ({ imageUris = [], onRemoveImage, onAddImage }) => {
    const scrollView = useRef();

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={scrollView}
                onContentSizeChange={() => {
                    scrollView.current.scrollToEnd();
                }}
            >
                <View style={styles.container}>
                    {imageUris.map((uri) => (
                        <View key={uri} style={styles.image}>
                            <ImageInput
                                imageUri={uri}
                                onChangeImage={() => onRemoveImage(uri)}
                            />
                        </View>
                    ))}
                    <ImageInput onChangeImage={(uri) => onAddImage(uri)} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    image: {
        marginRight: 10,
    },
});

export default ImageInputList;
