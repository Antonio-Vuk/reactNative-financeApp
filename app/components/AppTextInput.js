import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, icons, SIZES, FONTS } from "../constants";

const AppTextInput = ({ title, icon, value, setValue, style }) => {
    const [showPassword, setShowPassword] = useState(true);

    const expression = title == "Password" || title == "Repeat password";

    return (
        <View
            style={{
                height: SIZES.lineHeight,
                flexDirection: "row",
                ...style,
            }}
        >
            {/* Icon */}
            <View
                style={{
                    justifyContent: "flex-end",
                }}
            >
                <Feather name={icon} size={30} color={COLORS.primary} />
            </View>

            {/* TextInput */}
            <View style={{ flex: 1, paddingLeft: SIZES.base }}>
                <TextInput
                    value={value}
                    onChangeText={(text) => setValue(text)}
                    placeholder={title}
                    placeholderTextColor={COLORS.primary}
                    selectionColor={COLORS.secondary}
                    style={{
                        color: COLORS.primary,
                        borderBottomColor: COLORS.secondary,
                        borderBottomWidth: 1,
                        height: SIZES.lineHeight,
                        ...FONTS.body3,
                    }}
                    secureTextEntry={expression ? showPassword : false}
                />

                {/* Show password icon */}
                {expression && (
                    <View
                        style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            height: "100%",
                            width: SIZES.lineHeight,
                            justifyContent: "center",
                            alignItems: "flex-end",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Feather
                                name={showPassword ? icons.eye : icons.eyeSlash}
                                size={25}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default AppTextInput;
