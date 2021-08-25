import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { COLORS, SIZES } from "../constants";

const ImagaViever = ({ imageUris }) => {
    return (
        <View
            style={{
                padding: SIZES.base,
            }}
        >
            {imageUris.map((uri) => (
                <View key={uri} style={(styles.image, styles.container)}>
                    <Image source={{ uri }} style={{ ...styles.image }} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SIZES.h3,
        alignItems: "center",
        backgroundColor: COLORS.lightGray,
        borderRadius: 15,
        justifyContent: "center",
        width: "100%",
        height: SIZES.windowWidth * 0.75,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

export default ImagaViever;
