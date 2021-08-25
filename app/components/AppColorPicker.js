import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { ColorPicker } from "react-native-color-picker";
import { SIZES, STYLES } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import GoBackArrow from "./GoBackArrow";
import AppPageTitle from "./AppPageTitle";

const AppColorPicker = ({ source, setSource }) => {
    const [modal, setModal] = useState(false);

    return (
        <>
            <Modal animationType={STYLES.animationType} visible={modal}>
                <View
                    style={{
                        flex: 1,
                        paddingTop: SIZES.statusBarHeight,
                        paddingHorizontal: SIZES.padding,
                        paddingBottom: SIZES.padding * 2,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <GoBackArrow onPress={() => setModal(false)} />
                        <AppPageTitle title="Select Color" />
                        <View style={{ width: 50 }}></View>
                    </View>

                    <ColorPicker
                        defaultColor={source}
                        onColorSelected={(selected) => {
                            setSource(selected);
                            setModal(false);
                        }}
                        style={{ flex: 1 }}
                    />
                </View>
            </Modal>

            <TouchableOpacity onPress={() => setModal(true)}>
                <Ionicons
                    name="color-palette-outline"
                    size={40}
                    color={source}
                />
            </TouchableOpacity>
        </>
    );
};
export default AppColorPicker;
