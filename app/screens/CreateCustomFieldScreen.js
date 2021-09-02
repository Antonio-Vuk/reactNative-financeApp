import React, { useState, useContext } from "react";
import {
    View,
    Modal,
    Text,
    TouchableWithoutFeedback,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import {
    AppPageTitle,
    AppDivider,
    AppExpander,
    AppButton,
    GoBackArrow,
    CustomCategory,
} from "../components";
import { icons, STYLES, COLORS, SIZES, FONTS, constants } from "../constants";
import { AppContext } from "../contexts";
import { BlurView } from "expo-blur";
import { FontAwesome } from "@expo/vector-icons";
import { createCustomFieldController } from "../controllers/customFieldsController";
import { useNavigation } from "@react-navigation/native";
import { getCustomFiledType, showError } from "../utils/helpersFunctions";
import { defaultState } from "../store/state";

const CreateCustomFieldScreen = () => {
    const { state, setState } = useContext(AppContext);
    const navigation = useNavigation();

    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [listItems, setListItems] = useState([]);
    const [listItem, setListItem] = useState("");
    const [category, setCategory] = useState(0);

    const handleSave = async () => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }
        try {
            await createCustomFieldController(
                { fieldName, fieldType, listItems, category },
                () => {
                    setFieldName("");
                    setFieldType("");
                    setListItems([]);
                    setListItem();
                    setCategory(0);
                    setState({ ...defaultState });
                    navigation.goBack();
                }
            );
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    return (
        <View
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
                paddingHorizontal: SIZES.padding,
            }}
        >
            <ScrollView keyboardShouldPersistTaps="handled">
                <View
                    style={{
                        flexDirection: "row",
                        height: SIZES.lineHeight,
                    }}
                >
                    <GoBackArrow />
                    <AppPageTitle title="Add New Field" />
                    <View style={{ width: 50 }}></View>
                </View>

                <View
                    style={{
                        top: SIZES.padding,
                        ...STYLES.container,
                        ...STYLES.shadow,
                    }}
                >
                    <RenderInputField
                        value={fieldName}
                        setValue={setFieldName}
                        title="Field name"
                    />
                    <AppDivider />
                    <RenderInputPicker
                        value={fieldType}
                        setValue={setFieldType}
                    />
                    <AppDivider />

                    {fieldType == constants.list && (
                        <>
                            <View
                                style={{
                                    height: SIZES.lineHeight,
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...FONTS.h3,
                                            paddingRight: SIZES.padding,
                                        }}
                                    >
                                        Add New Item:
                                    </Text>

                                    <TextInput
                                        autoCorrect={false}
                                        placeholder="value"
                                        style={{
                                            ...FONTS.body3,
                                        }}
                                        textAlign="right"
                                        value={listItem}
                                        onChangeText={(item) =>
                                            setListItem(item)
                                        }
                                    />
                                </View>

                                {listItems.indexOf(listItem) == -1 &&
                                    listItem != undefined &&
                                    listItem != "" && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                var items = listItems;
                                                var index =
                                                    items.indexOf(listItem);
                                                if (index == -1) {
                                                    items.push(listItem);
                                                    setListItems(items);
                                                    setListItem("");
                                                }
                                            }}
                                        >
                                            <View>
                                                <FontAwesome
                                                    name={icons.check}
                                                    size={25}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                            </View>
                            <AppDivider />
                            <Text
                                style={{
                                    ...FONTS.body3,
                                    paddingTop: SIZES.padding,
                                }}
                            >
                                Items:
                            </Text>

                            <FlatList
                                keyboardShouldPersistTaps="handled"
                                data={listItems}
                                keyExtractor={(item) => item.toString()}
                                renderItem={(item) =>
                                    RenderCustomField(
                                        item,
                                        setListItems,
                                        listItems
                                    )
                                }
                            />
                        </>
                    )}
                    <Text style={{ ...FONTS.h3, marginTop: SIZES.base }}>
                        Category:
                    </Text>
                    <CustomCategory
                        state={state}
                        category={category}
                        setCategory={setCategory}
                    />
                </View>

                <View style={{ height: 30 }}></View>

                <AppButton label="Save" onPress={handleSave} />

                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const RenderCustomField = ({ item }, setListItems, listItems) => {
    return (
        <View
            style={{
                height: SIZES.lineHeight,
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Text style={{ ...FONTS.h3 }}>- {item}</Text>
                <AppExpander />
                <TouchableOpacity
                    onPress={() => {
                        setListItems(listItems.filter((el) => el != item));
                    }}
                >
                    <View
                        style={{
                            height: 40,
                            width: 50,
                            alignItems: "flex-end",
                            justifyContent: "center",
                        }}
                    >
                        <FontAwesome name={icons.remove} size={25} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const RenderInputPicker = ({
    value,
    setValue,
    data = [constants.text, constants.number, constants.date, constants.list],
    title = "Type",
}) => {
    const [modal, setModal] = useState(false);

    return (
        <>
            <Modal
                visible={modal}
                transparent
                animationType={STYLES.animationType}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        setModal(false);
                    }}
                >
                    <BlurView
                        tint="dark"
                        intensity={50}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: COLORS.lightgray,
                                height:
                                    SIZES.lineHeight * data.length +
                                    data.length * 2,
                                width: "60%",
                                backgroundColor: "white",
                            }}
                        >
                            <FlatList
                                data={data}
                                keyboardShouldPersistTaps="handled"
                                keyExtractor={(item) => item.toString()}
                                ItemSeparatorComponent={() => <AppDivider />}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModal(false);
                                            setValue(item);
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: SIZES.lineHeight,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text style={{ ...FONTS.h3 }}>
                                                {getCustomFiledType(item)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </BlurView>
                </TouchableWithoutFeedback>
            </Modal>

            <View
                style={{
                    flexDirection: "row",
                    height: 50,
                    alignItems: "center",
                }}
            >
                <Text style={{ ...FONTS.h3 }}>{title}:</Text>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "flex-end",
                    }}
                    onPress={() => setModal(true)}
                >
                    <Text
                        style={{
                            ...FONTS.body3,
                            color: value ? COLORS.black : COLORS.lightgray,
                        }}
                    >
                        {value ? getCustomFiledType(value) : "none"}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const RenderInputField = ({ value, setValue, title }) => {
    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    height: 50,
                    alignItems: "center",
                }}
            >
                <Text style={{ ...FONTS.h3 }}>{title}:</Text>
                <TextInput
                    onChangeText={(text) => setValue(text)}
                    style={{
                        ...FONTS.body3,
                        flex: 1,
                        textAlign: "right",
                    }}
                    placeholder={title}
                    keyboardType="default"
                    value={value.toString()}
                />
            </View>
        </View>
    );
};

export default CreateCustomFieldScreen;
