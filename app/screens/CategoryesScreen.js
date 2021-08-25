import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    FlatList,
} from "react-native";
import {
    AppDivider,
    DeleteActionsSwipeable,
    GoBackArrow,
    PageTitle,
} from "../components";
import { COLORS, constants, FONTS, SIZES, STYLES, icons } from "../constants";
import { AppContext } from "../contexts";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import routes from "../navigation/routes";
import { defaultState } from "../store/state";
import { deleteCategoryController } from "../controllers/categoryController";
import { showError } from "../utils/helpersFunctions";

const CategoryesScreen = ({ navigation }) => {
    const { state, setState } = useContext(AppContext);
    const [type, setType] = useState(constants.income);

    return (
        <View
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
            }}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: SIZES.padding }}>
                    <GoBackArrow text={true} />
                    <View
                        style={{
                            paddingVertical: SIZES.padding,
                            flexDirection: "row",
                        }}
                    >
                        <PageTitle
                            title={"Categories: " + state.categories.length}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(routes.category, {
                                    editMode: false,
                                    category: {},
                                });
                            }}
                            style={{
                                flex: 1,
                                alignItems: "flex-end",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesome
                                name="plus"
                                size={30}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                    </View>

                    {state.categories.length > 0 && (
                        <CategoryTypeSelector type={type} setType={setType} />
                    )}
                </View>
                <CategoryList
                    categories={state.categories.filter(
                        (item) =>
                            item.type == type || item.type == constants.both
                    )}
                    setState={setState}
                    navigation={navigation}
                />
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const CategoryList = ({ categories, setState, navigation }) => {
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
    const renderItem = ({ item }, navigation) => {
        return (
            <DeleteActionsSwipeable onPress={() => deleteCategoryPress(item)}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(routes.category, {
                            editMode: true,
                            category: item,
                        });
                    }}
                    style={{
                        height: SIZES.lineHeight,
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: SIZES.base,
                    }}
                >
                    <View
                        style={{
                            width: SIZES.lineHeight,
                            height: SIZES.lineHeight,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: COLORS.lightGray1,
                            borderRadius: SIZES.lineHeight / 2,
                        }}
                    >
                        <Image
                            source={item.icon}
                            style={{
                                width: SIZES.icon,
                                height: SIZES.icon,
                                tintColor: item.color,
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            paddingLeft: SIZES.padding,
                            ...FONTS.body2,
                            flex: 1,
                        }}
                    >
                        {item.name}
                    </Text>
                    <AntDesign
                        name={icons.foward}
                        size={30}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </DeleteActionsSwipeable>
        );
    };
    return (
        <>
            {categories.length > 0 && (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={(item) => renderItem(item, navigation)}
                    ItemSeparatorComponent={() => <AppDivider />}
                    contentContainerStyle={{
                        margin: SIZES.padding,
                        ...STYLES.container,
                        ...STYLES.shadow,
                    }}
                />
            )}
        </>
    );
};

const CategoryTypeSelector = ({ type, setType }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                height: SIZES.lineHeight,
                ...STYLES.shadow,
            }}
        >
            <TouchableOpacity
                onPress={() => setType(constants.income)}
                style={{
                    ...styles.touchable,
                    borderTopLeftRadius: SIZES.radius,
                    borderBottomLeftRadius: SIZES.radius,
                    borderWidth: 1,
                    backgroundColor:
                        type == constants.income
                            ? COLORS.lightgreen
                            : COLORS.white,
                }}
            >
                <Text style={{ ...FONTS.h3 }}>Income</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setType(constants.expense)}
                style={{
                    ...styles.touchable,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderRightWidth: 1,
                    borderTopRightRadius: SIZES.radius,
                    borderBottomRightRadius: SIZES.radius,
                    backgroundColor:
                        type == constants.expense ? COLORS.red : COLORS.white,
                }}
            >
                <Text style={{ ...FONTS.h3 }}>Expense</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    touchable: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default CategoryesScreen;
