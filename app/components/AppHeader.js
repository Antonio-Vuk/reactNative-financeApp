import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import AppExpander from "./AppExpander";
import { FontAwesome } from "@expo/vector-icons";

import { SIZES, COLORS, STYLES, icons } from "../constants";

const AppHeader = ({ onPress, title, children }) => {
    return (
        <View
            style={{
                flex: 1,
                height: SIZES.height,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Text style={{ ...STYLES.text, fontWeight: "bold" }}>{title}</Text>
            <AppExpander />
            <TouchableOpacity
                style={{
                    width: 70,
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "flex-end",
                }}
                onPress={onPress}
            >
                <>
                    {children ? (
                        children
                    ) : (
                        <FontAwesome
                            name={icons.plus}
                            size={SIZES.icon}
                            color={COLORS.black}
                        />
                    )}
                </>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default AppHeader;
