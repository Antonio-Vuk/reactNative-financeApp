import React, { useContext, useState } from "react";
import {
    View,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
} from "react-native";
import { STYLES, COLORS, SIZES, icons, FONTS, constants } from "../constants";
import { AppContext } from "../contexts";
import { BlurView } from "expo-blur";
import { AppExpander, AppDatePickerModal, AppDivider } from ".";
import { FontAwesome } from "@expo/vector-icons";
import { getCustomFieldListValue } from "../utils/helpersFunctions";
import { defaultState } from "../store/state";

const CustomFields = ({ categoryId }) => {
    const { state } = useContext(AppContext);

    return (
        <FlatList
            ItemSeparatorComponent={() => <AppDivider />}
            data={state.customFields.filter(
                (item) => item.category == 0 || item.category == categoryId
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View>
                    {item.type == constants.number && (
                        <RenderCustomNumberCell item={item} />
                    )}
                    {item.type == constants.text && (
                        <RenderCustomTextCell item={item} />
                    )}
                    {item.type == constants.date && (
                        <RenderCustomDateCell item={item} />
                    )}
                    {item.type == constants.list && (
                        <RenderCustomListCell item={item} />
                    )}
                </View>
            )}
        />
    );
};

const setCustomField = (vrijednost, id) => {
    var index = defaultState.customFields.findIndex((el) => el.id == id);
    if (index !== -1) {
        defaultState.customFields[index].value = vrijednost;
    }
};

const getCustomFieldValue = (id) => {
    let fields = defaultState.customFieldsValues.filter(
        (item) => item.customFieldId == id
    );
    if (fields.length > 0) {
        return fields[0].value;
    } else {
        return undefined;
    }
};

const RenderCustomNumberCell = ({ item }) => {
    const { state, setState } = useContext(AppContext);

    return (
        <View
            style={{
                flexDirection: "row",
                height: SIZES.lineHeight,
                alignItems: "center",
            }}
        >
            <Text style={{ ...FONTS.h3 }}>{item.name}:</Text>
            <TextInput
                value={item.value}
                placeholder={item.name}
                style={{
                    flex: 1,
                    textAlign: "right",
                    ...FONTS.body3,
                }}
                onChangeText={(vrijednost) => {
                    setCustomField(vrijednost, item.id);
                    setState({
                        ...defaultState,
                    });
                }}
            />
        </View>
    );
};

const RenderCustomTextCell = ({ item }) => {
    const { state, setState } = useContext(AppContext);

    return (
        <View
            style={{
                height: SIZES.lineHeight,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Text style={{ ...FONTS.h3 }}>{item.name}:</Text>

            <TextInput
                value={item.value}
                onChangeText={(vrijednost) => {
                    setCustomField(vrijednost, item.id);
                    setState({
                        ...defaultState,
                    });
                }}
                placeholder={item.name}
                style={{
                    flex: 1,
                    textAlign: "right",
                    ...FONTS.body3,
                }}
            />
        </View>
    );
};

const RenderCustomDateCell = ({ item }) => {
    const { state, setState } = useContext(AppContext);
    const [date, setDate] = useState(new Date(getCustomFieldValue(item.id)));

    return (
        <View
            style={{
                flexDirection: "row",
                height: SIZES.lineHeight,
                alignItems: "center",
            }}
        >
            <Text style={{ ...FONTS.h3 }}>{item.name}:</Text>

            <AppExpander />
            {item.value != undefined && (
                <>
                    <TouchableOpacity
                        onPress={() => {
                            setCustomField(undefined, item.id);
                            setState({
                                ...defaultState,
                            });
                        }}
                    >
                        <View
                            style={{
                                height: "100%",
                                width: 50,
                                justifyContent: "center",
                                alignItems: "flex-end",
                                paddingRight: 10,
                            }}
                        >
                            <FontAwesome name={icons.remove} size={20} />
                        </View>
                    </TouchableOpacity>

                    <AppDatePickerModal
                        date={date}
                        setDate={setDate}
                        custom={true}
                        visible={false}
                        onPress={(date) => {
                            setCustomField(date, item.id);
                            setState({
                                ...defaultState,
                            });
                        }}
                    />
                </>
            )}
            {item.value == undefined && (
                <TouchableOpacity
                    style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "flex-end",
                    }}
                    onPress={() => {
                        setCustomField(new Date(), item.id);
                        setDate(new Date());
                        setState({
                            ...defaultState,
                        });
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.body3,
                            color: COLORS.lightgray,
                        }}
                    >
                        none
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const RenderCustomListCell = ({ item }) => {
    const mainEl = item;
    const { state, setState } = useContext(AppContext);
    const [modal, setModal] = useState(false);

    const RenderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setModal(false);
                    setCustomField(item.id, mainEl.id);
                    setState({
                        ...defaultState,
                    });
                }}
            >
                <View
                    style={{
                        height: SIZES.lineHeight,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "bold" }}>{item.value}</Text>
                </View>
            </TouchableOpacity>
        );
    };

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
                                width: "60%",
                                backgroundColor: "white",
                            }}
                        >
                            <FlatList
                                data={state.customFieldsListValues.filter(
                                    (field) => field.customFieldId == item.id
                                )}
                                keyboardShouldPersistTaps="handled"
                                keyExtractor={(item) => item.id.toString()}
                                ItemSeparatorComponent={() => <AppDivider />}
                                renderItem={RenderItem}
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
                <Text style={{ ...FONTS.h3 }}>{item.name}:</Text>
                <AppExpander />
                {item.value != undefined && (
                    <TouchableOpacity
                        onPress={() => {
                            setCustomField(undefined, mainEl.id);
                            setState({
                                ...defaultState,
                            });
                        }}
                        style={{
                            height: "100%",
                            width: 50,
                            justifyContent: "center",
                            alignItems: "flex-end",
                            paddingRight: 10,
                        }}
                    >
                        <FontAwesome name={icons.remove} size={20} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={{
                        height: "100%",
                        justifyContent: "center",
                    }}
                    onPress={() => setModal(true)}
                >
                    <Text
                        style={{
                            ...FONTS.body3,
                            color: item.value ? COLORS.black : COLORS.lightgray,
                        }}
                    >
                        {item.value
                            ? getCustomFieldListValue(item.value)
                            : "none"}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default CustomFields;
