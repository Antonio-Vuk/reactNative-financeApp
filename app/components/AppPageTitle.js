import React from "react";
import { View, Text } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants";

function AppPageTitle({ title }) {
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: COLORS.lightGray,
                    borderRadius: SIZES.radius,
                    alignItems: "center",
                    alignSelf: "center",
                    padding: SIZES.base,
                }}
            >
                <Text style={{ ...FONTS.h2 }}>{title}</Text>
            </View>
        </View>
    );
}

export default AppPageTitle;
