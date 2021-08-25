import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";
import { format } from "date-fns";

import AppExpander from "./AppExpander";
import { icons, SIZES, COLORS, FONTS } from "../constants";

const AppDatePickerModal = ({
    date,
    setDate,
    custom = false,
    onPress = null,
    visible = false,
}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(visible);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(date);
        hideDatePicker();
        if (onPress) {
            onPress(date);
        }
    };

    return (
        <>
            <DateTimePickerModal
                date={date}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                    handleConfirm(date);
                }}
                onCancel={hideDatePicker}
            />
            <TouchableOpacity onPress={showDatePicker}>
                <View
                    style={{
                        flexDirection: "row",
                        height: SIZES.lineHeight,
                        alignItems: "center",
                    }}
                >
                    {custom == false && (
                        <>
                            <FontAwesome
                                name={icons.calendar}
                                size={SIZES.icon}
                                color={COLORS.primary}
                                style={{ paddingRight: SIZES.padding }}
                            />
                            <Text style={{ ...FONTS.h3 }}>Date:</Text>
                            <AppExpander />
                        </>
                    )}
                    <Text style={{ ...FONTS.body3 }}>
                        {/* {date.toLocaleDateString()} */}
                        {format(new Date(date), "yyy MMM dd")}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default AppDatePickerModal;
