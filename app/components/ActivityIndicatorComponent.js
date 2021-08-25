import React from "react";

import { View, Modal, ActivityIndicator } from "react-native";
import { COLORS, STYLES } from "../constants";

const ActivityIndicatorComponent = ({ visible }) => {
    return (
        <Modal
            transparent
            animationType={STYLES.animationType}
            visible={visible}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 30,
                        width: 60,
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 5,
                        borderColor: COLORS.secondary,
                    }}
                >
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </View>
        </Modal>
    );
};

export default ActivityIndicatorComponent;
