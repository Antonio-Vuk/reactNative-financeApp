import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { SIZES, COLORS, icons, FONTS, constants } from "../constants";
import { colorsData, iconsData } from "../utils/localStoredData";
import { AppContext } from "../contexts";
import { AppPageTitle, GoBackArrow, AppColorPicker } from "../components";
import { AntDesign } from "@expo/vector-icons";
import { defaultState } from "../store/state";
import {
    insertCategoryController,
    updateCategoryController,
} from "../controllers/categoryController";
import { showError } from "../utils/helpersFunctions";

const CategoryScreen = ({ route, navigation }) => {
    const { setState } = useContext(AppContext);

    const [title, setTitle] = useState("New Category");
    const [editMode] = useState(route.params.editMode);

    const [name, setName] = useState("");
    const [type, setType] = useState(constants.income);
    const [color, setColor] = useState(colorsData[0]);
    const [icon, setIcon] = useState(iconsData[0]);

    useEffect(() => {
        if (editMode == true) {
            setTitle("Edit Category");
            setName(route.params.category.name);
            setType(route.params.category.type);
            setColor(route.params.category.color);
            setIcon(route.params.category.icon);
        }
    }, []);

    const handleSave = async () => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }
        try {
            if (editMode == true) {
                const category = {
                    name,
                    type,
                    color,
                    icon,
                    id: route.params.category.id,
                };

                await updateCategoryController(category);
            } else {
                const category = {
                    name,
                    type,
                    color,
                    icon,
                };
                await insertCategoryController(category);
            }
            setState({ ...defaultState });
            navigation.goBack();
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    return (
        <View style={{ paddingTop: SIZES.statusBarHeight, flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <>
                            <View
                                style={{
                                    flexDirection: "row",
                                    height: SIZES.lineHeight,
                                    paddingHorizontal: SIZES.padding,
                                }}
                            >
                                <GoBackArrow
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                />
                                <AppPageTitle title={title} />
                                <View style={{ width: 50 }}>
                                    {name != "" && type != constants.zero && (
                                        <RenderRightAction
                                            onPress={handleSave}
                                        />
                                    )}
                                </View>
                            </View>
                            <RenderNameInput name={name} setName={setName} />

                            {editMode == false && (
                                <RenderCategoryTypeSelector
                                    type={type}
                                    setType={setType}
                                />
                            )}

                            <RenderColorListSection
                                color={color}
                                setColor={setColor}
                            />
                        </>
                    }
                    data={iconsData}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={4}
                    keyExtractor={(item) => item.toString()}
                    renderItem={(item) =>
                        renderIconListItem(item, icon, setIcon, color)
                    }
                />
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const RenderCategoryTypeSelector = ({ type, setType }) => {
    return (
        <>
            <View
                style={{
                    marginVertical: SIZES.base,
                    flexDirection: "row",
                    height: SIZES.lineHeight,
                    paddingHorizontal: SIZES.padding,
                    borderRadius: SIZES.radius,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        if (type == constants.income) {
                            setType(constants.zero);
                        } else if (type == constants.zero) {
                            setType(constants.income);
                        } else if (type == constants.expense) {
                            setType(constants.both);
                        } else if (type == constants.both) {
                            setType(constants.expense);
                        }
                    }}
                    style={{
                        flexDirection: "row",
                        height: "100%",
                        backgroundColor:
                            type == constants.income || type == constants.both
                                ? COLORS.lightgreen
                                : COLORS.white,
                        flex: 1,
                        borderTopLeftRadius: SIZES.radius,
                        borderBottomLeftRadius: SIZES.radius,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.h3,
                            color: COLORS.primary,
                            paddingLeft: SIZES.radius,
                        }}
                    >
                        Income
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (type == constants.income) {
                            setType(constants.both);
                        } else if (type == constants.zero) {
                            setType(constants.expense);
                        } else if (type == constants.expense) {
                            setType(constants.zero);
                        } else if (type == constants.both) {
                            setType(constants.income);
                        }
                    }}
                    style={{
                        flexDirection: "row",
                        height: "100%",
                        backgroundColor:
                            type == constants.expense || type == constants.both
                                ? COLORS.lightcoral
                                : COLORS.white,
                        flex: 1,
                        borderTopRightRadius: SIZES.radius,
                        borderBottomRightRadius: SIZES.radius,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.h3,
                            color: COLORS.primary,
                            paddingLeft: SIZES.radius,
                        }}
                    >
                        Expenses
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const RenderColorListSection = ({ color, setColor }) => {
    return (
        <FlatList
            ListHeaderComponent={
                <AppColorPicker source={color} setSource={setColor} />
            }
            ListHeaderComponentStyle={{
                justifyContent: "center",
                height: SIZES.lineHeight * 1.5,
            }}
            data={colorsData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            renderItem={(item) => RenderColorListItem(item, color, setColor)}
            contentContainerStyle={{
                paddingHorizontal: SIZES.padding,
            }}
        />
    );
};

const RenderColorListItem = ({ item }, color, setColor) => {
    return (
        <TouchableOpacity
            style={{
                height: SIZES.lineHeight * 1.5,
                width: 50,
                borderRadius: SIZES.radius,
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={() => {
                setColor(item);
            }}
        >
            <View
                style={{
                    height: item == color ? 40 : 30,
                    width: item == color ? 40 : 30,
                    backgroundColor: item,
                    borderRadius: SIZES.radius,
                    alignItems: "flex-start",
                    borderWidth: 1,
                }}
            />
        </TouchableOpacity>
    );
};

const RenderRightAction = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={{
                justifyContent: "center",
                alignItems: "flex-end",
                width: "100%",
                height: "100%",
            }}
            onPress={onPress}
        >
            <AntDesign name={icons.check} size={30} color={COLORS.primary} />
        </TouchableOpacity>
    );
};

const RenderNameInput = ({ name, setName }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: SIZES.padding,
            }}
        >
            <Text
                style={{
                    ...FONTS.h2,
                }}
            >
                Name:
            </Text>

            <TextInput
                autoCorrect={false}
                placeholder="Category Name"
                style={{
                    flex: 1,
                    height: "100%",
                    textAlign: "right",
                    ...FONTS.body2,
                }}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                }}
            />
        </View>
    );
};

const renderIconListItem = ({ item }, icon, setIcon, color) => {
    return (
        <TouchableOpacity
            style={{
                width: "25%",
                height: 70,
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={() => {
                setIcon(item);
            }}
        >
            <Image
                source={item}
                style={{
                    width: 50,
                    height: 50,
                    borderWidth: icon == item ? 1 : 0,
                    borderRadius: SIZES.radius,
                    backgroundColor: icon == item ? color : "transparent",
                }}
            />
        </TouchableOpacity>
    );
};

export default CategoryScreen;
