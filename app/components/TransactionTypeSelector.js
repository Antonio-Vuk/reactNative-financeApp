import React from "react";
import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, constants, FONTS, SIZES, STYLES } from "../constants";
import { AppContext } from "../contexts";

const TransactionTypeSelector = ({ type, setType }) => {
    const { state } = useContext(AppContext);
    const condition = state.wallets.length > 1;
    const borderWidth = 2;
    return (
        <View
            style={{
                flexDirection: "row",
                paddingTop: SIZES.padding,
                ...STYLES.shadow,
            }}
        >
            {/* Income */}
            <TouchableOpacity
                style={{
                    ...styles.touchable,
                    backgroundColor:
                        type == constants.income
                            ? COLORS.lightgreen
                            : COLORS.white,

                    borderTopLeftRadius: SIZES.radius,
                    borderBottomLeftRadius: SIZES.radius,
                    borderWidth,
                }}
                onPress={() => {
                    setType(constants.income);
                }}
            >
                <Text style={{ ...FONTS.h3 }}>Income</Text>
            </TouchableOpacity>

            {/* Expense */}
            <TouchableOpacity
                style={{
                    ...styles.touchable,
                    backgroundColor:
                        type == constants.expense
                            ? COLORS.lightcoral
                            : COLORS.white,

                    borderTopWidth: borderWidth,
                    borderBottomWidth: borderWidth,

                    borderTopRightRadius: condition ? 0 : SIZES.radius,
                    borderBottomRightRadius: condition ? 0 : SIZES.radius,
                    borderRightWidth: condition ? 0 : borderWidth,
                }}
                onPress={() => {
                    setType(constants.expense);
                }}
            >
                <Text style={{ ...FONTS.h3 }}>Expense</Text>
            </TouchableOpacity>

            {/* Transfer */}
            {condition && (
                <TouchableOpacity
                    style={{
                        ...styles.touchable,
                        backgroundColor:
                            type == constants.transfer
                                ? COLORS.lightgray
                                : COLORS.white,

                        borderTopRightRadius: SIZES.radius,
                        borderBottomRightRadius: SIZES.radius,
                        borderWidth,
                    }}
                    onPress={() => {
                        setType(constants.transfer);
                    }}
                >
                    <Text style={{ ...FONTS.h3 }}>Transfer</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    touchable: {
        flex: 1,
        height: SIZES.lineHeight,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default TransactionTypeSelector;
