import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
} from "react-native";
import { AppContext } from "../contexts";
import {
    getCategory,
    getColorByType,
    getTransaction,
    getWalletById,
    showError,
} from "../utils/helpersFunctions";
import {
    AppDivider,
    AppExpander,
    GoBackArrow,
    ImagaViever,
    LocationViewer,
} from "../components";
import { COLORS, constants, FONTS, icons, SIZES, STYLES } from "../constants";
import { format } from "date-fns";
import { AntDesign, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import routes from "../navigation/routes";
import { setFieldsValuesLocalState } from "../store/customFieldsState";
import {
    getCustomFieldById,
    getCustomFieldListValue,
} from "../utils/helpersFunctions";
import { defaultState } from "../store/state";

import { deleteTransactionController } from "../controllers/transactionController";
import { ScrollView } from "react-native-gesture-handler";
import { EventEmitter } from "../myEvents";

const TransactionScreen = ({ route, navigation }) => {
    const { state, setState } = useContext(AppContext);

    const transaction = getTransaction(route.params.transaction.id);

    const [type, setType] = useState(transaction.type);
    const [amount, setAmount] = useState(transaction.amount);
    const [date, setDate] = useState(transaction.date);
    const [note, setNote] = useState(transaction.note);
    const [toAccountId, setToAccountId] = useState(transaction.toAccountId);
    const [fromAccountId, setFromAccountId] = useState(
        transaction.fromAccountId
    );
    const [categoryId, setCategoryId] = useState(transaction.categoryId);
    const [imageUris, setImageUris] = useState([]);
    const [location, setLocation] = useState();

    useEffect(() => {
        if (defaultState.user != constants.offline) {
            setImageUris();
            if (Array.isArray(transaction.imageUris)) {
                setImageUris(transaction.imageUris);
            } else {
                setImageUris(JSON.parse(transaction.imageUris));
            }

            if (
                typeof transaction.location === "string" ||
                transaction.location instanceof String
            ) {
                setLocation(JSON.parse(transaction.location));
            } else {
                setLocation(transaction.location);
            }
        }
    }, []);

    const onDeletePress = async () => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }
        try {
            await deleteTransactionController(transaction, () => {
                EventEmitter.emit(constants.myEvent);
                setState({ ...defaultState });
                navigation.pop();
            });
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    const onEditPress = async () => {
        setFieldsValuesLocalState(transaction.id);
        setState({ ...defaultState });
        navigation.push(routes.editTransaction, {
            editMode: true,
            transaction,
            callBack: () => {
                const transaction = getTransaction(route.params.transaction.id);
                setType(transaction.type);
                setAmount(transaction.amount);
                setDate(transaction.date);
                setNote(transaction.note);
                setToAccountId(transaction.toAccountId);
                setFromAccountId(transaction.fromAccountId);
                setCategoryId(transaction.categoryId);
                if (Array.isArray(transaction.imageUris)) {
                    setImageUris(transaction.imageUris);
                } else {
                    setImageUris(JSON.parse(transaction.imageUris));
                }
            },
        });
    };

    const customs = state.customFieldsValues.filter(
        (item) => item.transactionId == transaction.id
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <SafeAreaView
                    style={{
                        paddingTop: SIZES.statusBarHeight,
                        backgroundColor: getCategory(categoryId).color,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: SIZES.padding,
                            paddingBottom: SIZES.padding,
                        }}
                    >
                        <View
                            style={{
                                height: SIZES.lineHeight,
                                flexDirection: "row",
                            }}
                        >
                            <GoBackArrow text={true} />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={getCategory(categoryId).icon}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        marginRight: 10,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {getCategory(categoryId).name}
                                </Text>
                            </View>
                            <AppExpander />
                            <View
                                style={{
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <View
                                    style={{
                                        padding: 5,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            ...FONTS.h2,
                                            color: getColorByType(type),
                                        }}
                                    >
                                        {amount} {state.currency.currenciesCode}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>

                <View style={{ padding: SIZES.padding }}>
                    {/* Render Delete and Edit Actions */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                        }}
                    >
                        {/* Delete Action */}
                        <TouchableOpacity
                            onPress={onDeletePress}
                            style={{
                                width: SIZES.lineHeight,
                                height: SIZES.lineHeight,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <AntDesign
                                name={icons.deleteIcon}
                                size={SIZES.icon}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>

                        {/* Edit Action */}
                        <TouchableOpacity
                            style={{
                                width: SIZES.lineHeight,
                                height: SIZES.lineHeight,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={onEditPress}
                        >
                            <FontAwesome5
                                name={icons.edit}
                                size={SIZES.icon}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>

                    <AppDivider />

                    {/* RenderDate */}
                    <View
                        style={{
                            flexDirection: "row",
                            height: SIZES.lineHeight,
                            alignItems: "center",
                        }}
                    >
                        <FontAwesome name={icons.calendar} size={SIZES.icon} />
                        <AppExpander />

                        <Text style={{ ...FONTS.body3 }}>
                            {format(new Date(date), "yyy MMM dd - H:MM")}
                        </Text>
                    </View>
                    <AppDivider />

                    {/* RenderNote */}

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <FontAwesome name={icons.note} size={SIZES.icon} />
                        <AppExpander />
                        <Text
                            style={{
                                textAlign: "right",
                                ...FONTS.body3,
                                padding: SIZES.padding,
                            }}
                        >
                            {note ? note : "-"}
                        </Text>
                    </View>
                    <AppDivider></AppDivider>
                    <RenderWallets
                        toAccountId={toAccountId}
                        fromAccountId={fromAccountId}
                    />

                    <AppDivider />

                    <RenderCustomFields customs={customs} />
                    {state.user != constants.offline && (
                        <ImagaViever imageUris={imageUris} />
                    )}

                    <LocationViewer location={location} />

                    <View style={{ height: 100 }}></View>
                </View>
            </ScrollView>
        </View>
    );
};

const RenderWallets = ({ toAccountId, fromAccountId }) => {
    return (
        <View>
            {toAccountId != null && toAccountId != "" && (
                <View
                    style={{
                        height: SIZES.lineHeight,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ flex: 1, ...FONTS.h3 }}>To Wallet:</Text>
                    <Text>{getWalletById(toAccountId).name}</Text>
                </View>
            )}

            {fromAccountId != null && fromAccountId != "" && (
                <View
                    style={{
                        height: SIZES.lineHeight,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ flex: 1, ...FONTS.h3 }}>From Wallet:</Text>
                    <Text>{getWalletById(fromAccountId).name}</Text>
                </View>
            )}
        </View>
    );
};

const RenderCustomFields = ({ customs }) => {
    return (
        <>
            {customs.map((item) => (
                <View key={item.id.toString()}>
                    <View
                        style={{
                            flexDirection: "row",
                            height: SIZES.height,
                            alignItems: "center",
                            height: SIZES.lineHeight,
                        }}
                    >
                        <Text
                            style={{
                                ...FONTS.h3,
                            }}
                        >
                            {getCustomFieldById(item.customFieldId).name}
                        </Text>
                        <AppExpander />

                        {getCustomFieldById(item.customFieldId).type ==
                            constants.date && (
                            <Text style={{ ...FONTS.body3 }}>
                                {format(
                                    new Date(item.value),
                                    "yyy MMM dd - H:MM"
                                )}
                            </Text>
                        )}

                        {getCustomFieldById(item.customFieldId).type ==
                            constants.list && (
                            <Text style={{ ...FONTS.body3 }}>
                                {getCustomFieldListValue(item.value)}
                            </Text>
                        )}

                        {(getCustomFieldById(item.customFieldId).type ==
                            constants.text ||
                            getCustomFieldById(item.customFieldId).type ==
                                constants.number) && (
                            <Text style={{ ...FONTS.body3 }}>{item.value}</Text>
                        )}
                    </View>
                    <AppDivider />
                </View>
            ))}
        </>
    );
};

export default TransactionScreen;
