import React from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { TouchableOpacity, View, Text } from "react-native";
import { COLORS, SIZES, FONTS, STYLES } from "../constants";

const DeleteActionsSwipeable = ({ children, onPress }) => {
    return (
        <Swipeable
            renderRightActions={() => (
                <TouchableOpacity
                    onPress={onPress}
                    style={{
                        marginLeft: SIZES.base,
                        marginVertical: SIZES.base / 2,
                        backgroundColor: "red",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: SIZES.radius,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                color: COLORS.white,
                                ...FONTS.h3,
                                padding: SIZES.base,
                            }}
                        >
                            Delete
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        >
            {children}
        </Swipeable>
    );
};

export default DeleteActionsSwipeable;
