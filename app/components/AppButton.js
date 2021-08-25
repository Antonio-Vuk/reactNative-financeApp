import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text } from "react-native";
import { COLORS, SIZES } from "../constants";
import { FONTS } from "../constants/theme";

function AppButton({ label, onPress, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={{ ...style }}>
            <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={{
                    height: SIZES.lineHeight,
                    borderRadius: SIZES.radius,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text
                    style={{
                        color: COLORS.white,
                        ...FONTS.h3,
                    }}
                >
                    {label}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default AppButton;
