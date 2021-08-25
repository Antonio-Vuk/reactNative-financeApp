import React from "react";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, icons, SIZES } from "../constants";

const CircleButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.primary,
                borderRadius: 25,
            }}
        >
            <FontAwesome
                name={icons.check}
                size={SIZES.icon}
                color={COLORS.white}
            />
        </TouchableOpacity>
    );
};

export default CircleButton;
