import React, { useContext, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SIZES, COLORS, STYLES, constants } from "../constants";
import { showError, subString } from "../utils/helpersFunctions";
import { AppContext } from "../contexts";
import routes from "../navigation/routes";
import { deleteCategoryController } from "../controllers/categoryController";
import { defaultState } from "../store/state";

const SelectCategory = ({ type, categoryId, setCategoryId }) => {
    const navigation = useNavigation();
    const { state, setState } = useContext(AppContext);
    const flatList = useRef();

    const deleteCategoryPress = (item) => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }
        try {
            deleteCategoryController(item, () => {
                setState({ ...defaultState });
            });
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    return (
        <FlatList
            ref={flatList}
            data={state.categories.filter(
                (item) => item.type == type || item.type == constants.both
            )}
            horizontal
            onContentSizeChange={() => {
                if (categoryId) {
                    if (
                        categoryId ==
                        state.categories[state.categories.length - 1].id
                    )
                        flatList.current.scrollToEnd();
                }
            }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => {
                        setCategoryId(item.id);
                        if (categoryId == item.id) {
                            navigation.navigate(routes.category, {
                                editMode: true,
                                category: item,
                            });
                        }
                    }}
                    onLongPress={() => deleteCategoryPress(item)}
                    style={{
                        padding: SIZES.padding / 2,
                        backgroundColor:
                            categoryId == item.id ? item.color : COLORS.white,
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SIZES.padding / 2,
                        ...STYLES.shadow,
                    }}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                                categoryId == item.id
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
                            ...STYLES.text,
                        }}
                    >
                        {subString(item.name)}
                    </Text>
                </TouchableOpacity>
            )}
            contentContainerStyle={{
                padding: SIZES.padding,
            }}
        />
    );
};

export default SelectCategory;
