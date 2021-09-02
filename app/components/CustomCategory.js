import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { STYLES, FONTS, SIZES, COLORS, constants } from "../constants";
import { subString } from "../utils/helpersFunctions";

const CustomCategory = ({ state, category, setCategory }) => {
    return (
        <View>
            <FlatList
                ListHeaderComponent={() => (
                    <TouchableOpacity
                        style={{
                            width: 50,
                            height: 97,
                            padding: SIZES.padding / 2,
                            backgroundColor:
                                category == 0 ? COLORS.primary : COLORS.white,
                            borderRadius: SIZES.radius,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.padding / 2,
                            ...STYLES.shadow,
                        }}
                        onPress={() => {
                            setCategory(0);
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color:
                                    category == 0 ? COLORS.white : COLORS.black,
                                ...FONTS.h4,
                            }}
                        >
                            Al Categories
                        </Text>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setCategory(item.id);
                        }}
                        style={{
                            padding: SIZES.padding / 2,
                            backgroundColor:
                                category == item.id && category != 0
                                    ? item.color
                                    : COLORS.white,
                            borderRadius: SIZES.radius,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.padding / 2,
                            ...STYLES.shadow,
                            paddingBottom: 0,
                            paddingHorizontal: 0,
                        }}
                    >
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                marginHorizontal: SIZES.base / 2,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    category == item.id && category != 0
                                        ? COLORS.white
                                        : COLORS.lightgray,
                            }}
                        >
                            <Image
                                source={item.icon}
                                resizeMode="contain"
                                style={{
                                    width: 30,
                                    height: 30,
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                marginTop: SIZES.padding,
                                color: COLORS.black,
                                ...FONTS.h4,
                            }}
                        >
                            {subString(item.name)}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                height: 10,
                                width: "100%",
                            }}
                        >
                            {item.type == constants.income && (
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: COLORS.green,
                                        borderBottomLeftRadius:
                                            SIZES.radius * 2,
                                        borderBottomRightRadius:
                                            SIZES.radius * 2,
                                    }}
                                ></View>
                            )}
                            {item.type == constants.expense && (
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: COLORS.red,
                                        borderBottomLeftRadius:
                                            SIZES.radius * 2,
                                        borderBottomRightRadius:
                                            SIZES.radius * 2,
                                    }}
                                ></View>
                            )}
                            {item.type == constants.both && (
                                <>
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: COLORS.green,
                                            borderBottomLeftRadius:
                                                SIZES.radius * 2,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: COLORS.red,
                                            borderBottomRightRadius:
                                                SIZES.radius * 2,
                                        }}
                                    />
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                data={state.categories}
                contentContainerStyle={{ margin: 10 }}
            />
        </View>
    );
};

export default CustomCategory;
