import React, { useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    FlatList,
    ScrollView,
} from "react-native";
import { AppPageTitle, AppDivider, GoBackArrow } from "../components";
import { COLORS, constants, FONTS, icons, SIZES, STYLES } from "../constants";
import { AppContext } from "../contexts";
import { Feather, AntDesign, FontAwesome } from "@expo/vector-icons";
import {
    editCustomFieldNameController,
    deleteCustomFieldController,
    createCustomFieldListValueController,
    deleteCustomFieldListValueController,
    editCustomFieldListValueController,
} from "../controllers/customFieldsController";

import routes from "../navigation/routes";
import {
    errorMessage,
    getCustomFiledType,
    showError,
    successMessage,
} from "../utils/helpersFunctions";
import { defaultState } from "../store/state";
import { showMessage } from "react-native-flash-message";

const CustomFieldSettingsScreen = ({ navigation }) => {
    const { state, setState } = useContext(AppContext);

    const onEditCustomFieldPress = async (item) => {
        try {
            await Alert.prompt(
                "Edit name",
                "Enter new name for custom field: " + item.name,
                [
                    {
                        text: "Cancel",
                    },
                    {
                        text: "Ok",
                        onPress: async (value) => {
                            if (value == "") {
                                errorMessage("Entered value is empty!");
                                return;
                            }
                            await editCustomFieldNameController(item, value);
                            successMessage("Custom field renamed!");
                            setState({ ...defaultState });
                        },
                    },
                ]
            );
        } catch (error) {
            showError(error);
        }
    };

    const onDeleteCustomFieldPress = async (item) => {
        try {
            await Alert.alert(
                "Delete Custom Field",
                "Are you sure you want to delete custom field: " +
                    item.name +
                    " and all data?",
                [
                    {
                        text: "No",
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            await deleteCustomFieldController(item);
                            successMessage("Custom field deleted!");
                            setState({ ...defaultState });
                        },
                    },
                ]
            );
        } catch (error) {
            showError(error);
        }
    };

    const OnAddNewCustomFieldValuePress = (item) => {
        try {
            Alert.prompt("Add new Value", "Insert new custom field value", [
                {
                    text: "Cancel",
                },
                {
                    text: "Ok",
                    onPress: async (value) => {
                        await createCustomFieldListValueController(
                            item.id,
                            value
                        );
                        successMessage("New custom field list value added!");
                        setState({ ...defaultState });
                    },
                },
            ]);
        } catch (error) {
            showError(error);
        }
    };

    const onEditCustomFieldListValuePress = (id) => {
        try {
            Alert.prompt("Edit", "Change name of custom field list value", [
                {
                    text: "Cancel",
                },
                {
                    text: "Ok",
                    onPress: async (value) => {
                        if (value == "") {
                            errorMessage("Entered value is empty!");
                            return;
                        }
                        await editCustomFieldListValueController(value, id);
                        successMessage("Custom field list value renamed!");
                        setState({ ...defaultState });
                    },
                },
            ]);
        } catch (error) {
            showError(error);
        }
    };

    const onDeleteCustomListValuePress = async (item, el) => {
        try {
            await Alert.alert(
                "Delete Custom Field List Option",
                "Are you sure you want to delete custom field list option: " +
                    el.value +
                    " and all data?",
                [
                    {
                        text: "No",
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            if (
                                customFieldsListValues(state, item.id).length >
                                2
                            ) {
                                await deleteCustomFieldListValueController(
                                    el.id
                                );
                                successMessage("List value deleted!");
                                setState({ ...defaultState });
                            } else {
                                errorMessage("Two items are required!");
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            showError(error);
        }
    };

    const RenderItem = ({ item }) => {
        const { state } = useContext(AppContext);
        return (
            <View key={item.id.toString()}>
                <View
                    style={{
                        height: SIZES.lineHeight,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: 30,
                            height: "100%",
                            justifyContent: "center",
                        }}
                        onPress={() => onEditCustomFieldPress(item)}
                    >
                        <Feather
                            name={icons.edit}
                            size={SIZES.icon}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: 30,
                            height: "100%",
                            justifyContent: "center",
                        }}
                        onPress={() => onDeleteCustomFieldPress(item)}
                    >
                        <AntDesign
                            name={icons.deleteIcon}
                            size={SIZES.icon}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>

                    <Text style={{ ...FONTS.h3, flex: 1 }}>{item.name}</Text>

                    <View
                        style={{
                            height: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ ...FONTS.body3 }}>
                            {getCustomFiledType(item.type)}
                        </Text>

                        {item.type == constants.list && (
                            <TouchableOpacity
                                style={{
                                    height: "100%",
                                    paddingLeft: 10,
                                    justifyContent: "center",
                                }}
                                onPress={() =>
                                    OnAddNewCustomFieldValuePress(item)
                                }
                            >
                                <FontAwesome
                                    name={icons.plus}
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {item.type == constants.list && (
                    <View style={{ flexDirection: "row" }}>
                        <View
                            style={{
                                justifyContent: "flex-start",
                                flex: 1,
                            }}
                        >
                            <Text style={{ ...FONTS.h4 }}>Options:</Text>
                        </View>

                        <View>
                            {customFieldsListValues(state, item.id).map(
                                (el) => (
                                    <View
                                        key={el.id.toString()}
                                        style={{
                                            height: SIZES.lineHeight,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                right: -10,
                                                ...FONTS.body4,
                                            }}
                                        >
                                            {el.value}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                onDeleteCustomListValuePress(
                                                    item,
                                                    el
                                                )
                                            }
                                            style={{
                                                width: 40,
                                                height: "100%",
                                                justifyContent: "center",
                                                alignItems: "flex-end",
                                            }}
                                        >
                                            <AntDesign
                                                name={icons.deleteIcon}
                                                size={20}
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() =>
                                                onEditCustomFieldListValuePress(
                                                    el.id
                                                )
                                            }
                                            style={{
                                                width: 40,
                                                height: "100%",
                                                justifyContent: "center",
                                                alignItems: "flex-end",
                                            }}
                                        >
                                            <Feather
                                                name={icons.edit}
                                                size={20}
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
                paddingHorizontal: SIZES.padding,
            }}
        >
            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        height: SIZES.lineHeight,
                    }}
                >
                    <GoBackArrow />
                    <AppPageTitle title="Custom Fields" />
                    <View style={{ width: 50 }}>
                        <TouchableOpacity
                            style={{
                                width: "100%",
                                height: "100%",

                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={() =>
                                navigation.navigate(routes.createCustomField)
                            }
                        >
                            <FontAwesome
                                name={icons.plus}
                                size={SIZES.icon}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={{
                        ...STYLES.container,
                        top: SIZES.padding,
                        ...STYLES.shadow,
                    }}
                >
                    {state.customFields.length > 0 && (
                        <View
                            style={{
                                flexDirection: "row",
                                height: SIZES.lineHeight,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ ...FONTS.h2, flex: 1 }}>NAME</Text>
                            <Text style={{ ...FONTS.h2 }}>Type</Text>
                        </View>
                    )}

                    {state.customFields.length == 0 && (
                        <View>
                            <Text style={{ ...FONTS.h2 }}>
                                No custom fields
                            </Text>
                        </View>
                    )}

                    <FlatList
                        data={state.customFields}
                        renderItem={({ item }) => <RenderItem item={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => <AppDivider />}
                    />
                </View>
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const customFieldsListValues = (state, id) => {
    let items = state.customFieldsListValues.filter(
        (el) => el.customFieldId == id
    );
    return items;
};

export default CustomFieldSettingsScreen;
