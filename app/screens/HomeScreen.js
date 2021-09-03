import React, { useContext } from "react";
import {
    ImageBackground,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { AppContext } from "../contexts";
import {
    COLORS,
    constants,
    FONTS,
    icons,
    images,
    SIZES,
    STYLES,
} from "../constants";
import { FontAwesome } from "@expo/vector-icons";
import routes from "../navigation/routes";
import { PieChartCategoryes } from "../components";
import { useNavigation } from "@react-navigation/core";
import {
    ballanceLast24Hours,
    totalBalance,
    getWalletBallance,
    getCategory,
    getWalletById,
    showError,
    successMessage,
} from "../utils/helpersFunctions";
import {
    setFieldsValuesLocalState,
    unSetFieldsValuesLocalState,
} from "../store/customFieldsState";
import { defaultState } from "../store/state";
import {
    createFuturedTransactionController,
    deleteTransactionController,
} from "../controllers/transactionController";
import useLocation from "../hooks/useLocation";

const HomeScreen = () => {
    const { state, setState } = useContext(AppContext);

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={images.banner}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: "70%",
                }}
            ></ImageBackground>

            <ScrollView style={{ flex: 1 }}>
                <RenderHeader setState={setState} />
                {state.transactions.length > 0 && <PieChartCategoryes />}
                <RenderIncomingTransactions state={state} setState={setState} />
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const RenderIncomingTransactions = ({ state, setState }) => {
    const navigation = useNavigation();
    const location = useLocation();

    const renderItem = ({ item, index }) => {
        const category = getCategory(item.categoryId);

        return (
            <TouchableOpacity
                style={{
                    width: 300,
                    marginRight: SIZES.padding,
                    marginLeft: index == 0 ? SIZES.padding : 0,
                    marginVertical: SIZES.radius,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.white,
                    ...STYLES.shadow,
                }}
                onPress={() => {
                    setFieldsValuesLocalState(item.id);
                    setState({ ...defaultState });
                    navigation.push(routes.editTransaction, {
                        editMode: true,
                        transaction: item,
                        template: true,
                        callBack: () => {},
                    });
                }}
                onLongPress={async () => {
                    if (defaultState.user != constants.offline) {
                        defaultState.loading = true;
                        setState({ ...defaultState });
                    }
                    try {
                        await deleteTransactionController(item, () => {
                            setState({ ...defaultState });
                        });
                    } catch (error) {
                        showError(error);
                    } finally {
                        defaultState.loading = false;
                        setState({ ...defaultState });
                    }
                }}
            >
                {/* Title */}
                <View
                    style={{
                        flexDirection: "row",
                        padding: SIZES.padding,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            backgroundColor: COLORS.lightGray,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.base,
                        }}
                    >
                        <Image
                            source={category.icon}
                            style={{
                                width: 30,
                                height: 30,
                                tintColor: category.color,
                            }}
                        ></Image>
                    </View>
                    <Text
                        style={{
                            ...FONTS.h3,
                            color: category.color,
                        }}
                    >
                        {category.name}
                    </Text>
                </View>

                <View
                    style={{
                        paddingHorizontal: SIZES.padding,
                        paddingBottom: SIZES.padding,
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.body3,
                            flexWrap: "wrap",
                            color: COLORS.darkgray,
                        }}
                    >
                        Wallet:{" "}
                        {item.toAccountId
                            ? getWalletById(item.toAccountId).name
                            : ""}
                        {item.fromAccountId
                            ? getWalletById(item.fromAccountId).name
                            : ""}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.body3,
                            flexWrap: "wrap",
                            color: COLORS.darkgray,
                        }}
                    >
                        {item.note ? item.note : " "}
                    </Text>
                </View>

                <TouchableOpacity
                    style={{
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottomStartRadius: SIZES.radius,
                        borderBottomEndRadius: SIZES.radius,
                        backgroundColor:
                            item.type == constants.income
                                ? COLORS.lightgreen
                                : COLORS.lightpink,
                    }}
                    onPress={async () => {
                        if (defaultState.user != constants.offline) {
                            defaultState.loading = true;
                            setState({ ...defaultState });
                        }
                        try {
                            const {
                                id,
                                type,
                                amount,
                                note,
                                toAccountId,
                                fromAccountId,
                                categoryId,
                            } = item;

                            let transaction = {
                                id,
                                type,
                                amount,
                                note,
                                toAccountId,
                                fromAccountId,
                                categoryId,
                                date: new Date(),
                                status: constants.processed,
                            };
                            if (defaultState.user != constants.offline) {
                                transaction.location = JSON.stringify(location);
                                transaction.imageUris = item.imageUris;
                            }
                            await createFuturedTransactionController(
                                transaction
                            );
                            successMessage("Transaction created!");
                            setState({ ...defaultState });
                        } catch (error) {
                            showError(error);
                        } finally {
                            defaultState.loading = false;
                            setState({ ...defaultState });
                        }
                    }}
                >
                    <Text
                        style={{
                            color:
                                item.type == constants.income
                                    ? COLORS.black
                                    : COLORS.white,
                            ...FONTS.body3,
                        }}
                    >
                        CONFIRM {item.amount} {state.currency.currenciesCode}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View
            style={{
                ...STYLES.container,
                ...STYLES.shadow,
                margin: SIZES.padding,
            }}
        >
            {/* Incoming transactions title */}
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <Text style={{ flex: 1, ...FONTS.h2 }}>Incoming expenses</Text>

                <TouchableOpacity
                    onPress={() => {
                        unSetFieldsValuesLocalState();
                        setState({ ...defaultState });
                        navigation.navigate(routes.editTransaction, {
                            editMode: false,
                            template: true,
                        });
                    }}
                >
                    <FontAwesome name="plus" size={30} color={COLORS.black} />
                </TouchableOpacity>
            </View>
            {state.transactions.filter((t) => t.status == constants.pending)
                .length > 0 && (
                <FlatList
                    data={state.transactions.filter(
                        (t) => t.status == constants.pending
                    )}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                ></FlatList>
            )}
        </View>
    );
};

const RenderHeader = ({ setState }) => {
    const { state } = useContext(AppContext);
    const navigation = useNavigation();
    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={{
                width: 180,
                height: 150,
                padding: SIZES.padding,
                marginLeft: index == 0 ? SIZES.padding : 0,
                marginRight: SIZES.radius,
                backgroundColor: COLORS.white,
                borderRadius: SIZES.radius,
            }}
            onPress={() => {
                unSetFieldsValuesLocalState();
                setState({ ...defaultState });
                navigation.navigate(routes.editTransaction, {
                    editMode: false,
                    wallet: item,
                });
            }}
            onLongPress={() => {
                navigation.navigate(routes.wallet, {
                    editMode: true,
                    wallet: item,
                });
            }}
        >
            <View
                style={{
                    height: SIZES.lineHeight,
                    width: SIZES.lineHeight,
                    backgroundColor: item.color,
                    borderRadius: SIZES.radius,
                }}
            />
            <Text style={{ ...FONTS.body3, color: COLORS.gray }}>
                {item.name}
            </Text>
            <Text style={{ ...FONTS.h1 }}>{getWalletBallance(item)}</Text>
            <Text style={{ ...FONTS.body2 }}>
                {state.currency.currenciesCode}
            </Text>
        </TouchableOpacity>
    );
    return (
        <View
            style={{
                ...STYLES.shadow,
            }}
        >
            <View
                style={{
                    flex: 1,
                    paddingTop: "20%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                    Your total balance:
                </Text>
                <Text
                    style={{
                        marginTop: SIZES.base,
                        color: COLORS.white,
                        ...FONTS.h1,
                    }}
                >
                    {totalBalance(state)}
                </Text>
                <Text style={{ color: COLORS.white, ...FONTS.body4 }}>
                    ${ballanceLast24Hours()} Last 24 hours
                </Text>
            </View>

            <View>
                <Text
                    style={{
                        marginLeft: SIZES.padding,
                        color: COLORS.white,
                        ...FONTS.h2,
                    }}
                >
                    Wallets
                </Text>
                <FlatList
                    contentContainerStyle={{
                        marginTop: SIZES.base,
                    }}
                    data={state.wallets}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={
                        <TouchableOpacity
                            style={{
                                marginLeft:
                                    state.wallets.length == 0
                                        ? SIZES.padding
                                        : 0,
                            }}
                            onPress={() => {
                                navigation.navigate(routes.wallet, {
                                    editMode: false,
                                });
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: SIZES.radius,
                                    height: 150,
                                    width: 180,
                                    backgroundColor: COLORS.lightGray1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: 25,
                                        backgroundColor: COLORS.secondary,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <FontAwesome
                                        name={icons.plus}
                                        size={30}
                                        color={COLORS.white}
                                    />
                                </View>
                                <Text
                                    style={{
                                        paddingTop: SIZES.base,
                                    }}
                                >
                                    Add Wallet
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        </View>
    );
};

export default HomeScreen;
