import React, { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { format } from "date-fns";

import {
    AppDivider,
    CustomCategory,
    DeleteActionsSwipeable,
    AppExpander,
    AppDatePickerModal,
} from "../components";
import { AppContext } from "../contexts";
import { COLORS, constants, FONTS, icons, SIZES, STYLES } from "../constants";
import { getCategory, showError, subString } from "../utils/helpersFunctions";
import routes from "../navigation/routes";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import { getColorByType } from "../utils/helpersFunctions";
import { defaultState } from "../store/state";
import {
    setFieldsValuesLocalState,
    unSetFieldsValuesLocalState,
} from "../store/customFieldsState";
import { deleteTransactionController } from "../controllers/transactionController";
import { EventEmitter } from "../myEvents";

const TransactionsScreen = () => {
    const { state, setState } = useContext(AppContext);
    const [category, setCategory] = useState(0);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();

    return (
        <ScrollView
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
            }}
        >
            {state.transactions.length > 0 && (
                <View
                    style={{
                        margin: SIZES.padding,
                        ...STYLES.container,
                        ...STYLES.shadow,
                    }}
                >
                    <DateFilters
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                    />
                    <CustomCategory
                        state={state}
                        category={category}
                        setCategory={setCategory}
                    />
                </View>
            )}
            <TransactionList
                toDate={toDate}
                fromDate={fromDate}
                category={category}
            />
        </ScrollView>
    );
};
export default TransactionsScreen;

const TransactionList = ({ toDate, fromDate, category }) => {
    const { state, setState } = useContext(AppContext);
    const [transactions, setTransactions] = useState(state.transactions);
    const navigation = useNavigation();

    useEffect(() => {
        EventEmitter.on(constants.myEvent, filteredData);
        return () => {
            EventEmitter.removeListener(constants.myEvent, filteredData);
        };
    }, []);

    const displayMessage = () => {
        return state.transactions.length > 0
            ? "Transactions"
            : "No Transactions";
    };

    useEffect(() => {
        filteredData();
    }, [toDate, fromDate, category]);

    const filteredData = () => {
        let transactions = defaultState.transactions;

        if (fromDate) {
            transactions = transactions.filter(
                (t) => new Date(t.date) >= fromDate
            );
        }

        if (toDate) {
            transactions = transactions.filter(
                (t) => new Date(toDate) >= new Date(t.date)
            );
        }

        transactions = transactions.filter(
            (t) => t.categoryId == category || category == "0"
        );

        transactions = transactions.filter(
            (t) => t.status == constants.processed
        );

        transactions = transactions.sort((a, b) => {
            return new Date(a.date) < new Date(b.date);
        });
        setTransactions(transactions);
    };

    return (
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <>
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <Text style={{ flex: 1, ...FONTS.h2 }}>
                                {displayMessage()}
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    unSetFieldsValuesLocalState();
                                    setState({ ...defaultState });
                                    navigation.navigate(
                                        routes.editTransaction,
                                        { editMode: false }
                                    );
                                }}
                            >
                                <FontAwesome
                                    name="plus"
                                    size={30}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                        </View>

                        {state.transactions.length > 0 && (
                            <Text
                                style={{ ...FONTS.body3, color: COLORS.gray }}
                            >
                                Total: {state.transactions.length}
                            </Text>
                        )}
                        <View />
                    </>
                )}
                data={transactions}
                renderItem={(item) =>
                    RenderListItem(
                        item,
                        state,
                        setState,
                        navigation,
                        filteredData
                    )
                }
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <AppDivider />}
                contentContainerStyle={{
                    margin: SIZES.padding,
                    ...STYLES.container,
                    ...STYLES.shadow,
                }}
            />
            <View style={{ height: 100 }}></View>
        </>
    );
};

const RenderListItem = (
    { item },
    state,
    setState,
    navigation,
    filteredData
) => {
    var category = getCategory(item.categoryId);

    return (
        <View>
            <DeleteActionsSwipeable
                onPress={async () => {
                    if (defaultState.user != constants.offline) {
                        defaultState.loading = true;
                        setState({ ...defaultState });
                    }
                    try {
                        deleteTransactionController(item, () => {
                            filteredData();
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
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: SIZES.base,
                    }}
                    onPress={() => {
                        setFieldsValuesLocalState(item.id);
                        setState({ ...defaultState });
                        navigation.navigate(routes.transaction, {
                            transaction: item,
                        });
                    }}
                >
                    <Image
                        source={category.icon}
                        style={{
                            width: 35,
                            height: 35,
                            tintColor: category.color,
                        }}
                    />
                    <View style={{ flex: 1, marginLeft: SIZES.radius }}>
                        <Text style={{ ...FONTS.h3 }}>{category.name}</Text>
                        {item.note != "" && (
                            <Text>{subString(item.note, 20)}</Text>
                        )}
                        <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>
                            {format(new Date(item?.date), "yyyy MMM dd - H:MM")}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            height: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: getColorByType(item.type),
                                ...FONTS.h3,
                            }}
                        >
                            {item.amount} {state.currency.currenciesCode}
                        </Text>
                        <AntDesign
                            name={icons.foward}
                            size={30}
                            color={COLORS.primary}
                        />
                    </View>
                </TouchableOpacity>
            </DeleteActionsSwipeable>
        </View>
    );
};

const DateFilters = ({ fromDate, setFromDate, toDate, setToDate }) => {
    return (
        <>
            <View
                style={{
                    height: SIZES.lineHeight,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        ...FONTS.h2,
                    }}
                >
                    FILTER
                </Text>
            </View>
            <AppDivider />
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: SIZES.lineHeight,
                }}
            >
                <Text style={{ ...FONTS.h3 }}>From date:</Text>
                <AppExpander />
                {fromDate != undefined && (
                    <>
                        <TouchableOpacity
                            onPress={() => {
                                setFromDate(undefined);
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
                            date={fromDate}
                            setDate={setFromDate}
                            custom={true}
                            visible={false}
                            onPress={(date) => {
                                setFromDate(date);
                            }}
                        />
                    </>
                )}
                {fromDate == undefined && (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "flex-end",
                        }}
                        onPress={() => {
                            setFromDate(new Date());
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
            <AppDivider />
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: SIZES.lineHeight,
                }}
            >
                <Text style={{ ...FONTS.h3 }}>From date:</Text>
                <AppExpander />
                {toDate != undefined && (
                    <>
                        <TouchableOpacity
                            onPress={() => {
                                setToDate(undefined);
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
                            date={toDate}
                            setDate={setToDate}
                            custom={true}
                            visible={false}
                            onPress={(date) => {
                                setToDate(date);
                            }}
                        />
                    </>
                )}
                {toDate == undefined && (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "flex-end",
                        }}
                        onPress={() => {
                            setToDate(new Date());
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
            <AppDivider />
        </>
    );
};
