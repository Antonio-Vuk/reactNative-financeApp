import React from "react";
import { View, SafeAreaView } from "react-native";
import { SIZES } from "../constants";

const Screen = ({ children, style }) => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                ...style,
                paddingTop: SIZES.statusBarHeight,
            }}
        >
            <View style={{ flex: 1, ...style }}>{children}</View>
        </SafeAreaView>
    );
};
export default Screen;
