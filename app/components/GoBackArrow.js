import React from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES, FONTS, icons } from "../constants";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";

const GoBackArrow = ({ onPress = null, text = false }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => {
                if (onPress) {
                    onPress();
                } else {
                    navigation.goBack();
                }
            }}
            style={{
                flexDirection: "row",
                alignItems: "center",
                width: text ? undefined : 50,
            }}
        >
            <AntDesign
                name={icons.back}
                size={30}
                color={text ? COLORS.gray : COLORS.primary}
            />
            {text && (
                <Text
                    style={{
                        marginLeft: SIZES.base,
                        ...FONTS.h2,
                    }}
                >
                    Back
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default GoBackArrow;
