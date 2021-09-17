import React, { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
} from "react-native";
import { format } from "date-fns";

import {
    AppDivider,
    CustomCategory,
    DeleteActionsSwipeable,
    AppExpander,
    AppDatePickerModal,
    GoBackArrow,
    AppPageTitle,
} from "../components";
import { AppContext } from "../contexts";
import { COLORS, constants, FONTS, icons, SIZES, STYLES } from "../constants";
import {
    getCategory,
    getWalletNameById,
    showError,
    subString,
} from "../utils/helpersFunctions";
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
    const [transactions, setTransactions] = useState(state.transactions);

    useEffect(() => {
        filteredData();
    }, [toDate, fromDate, category]);

    useEffect(() => {
        EventEmitter.on(constants.myEvent, filteredData);
        return () => {
            EventEmitter.removeListener(constants.myEvent, filteredData);
        };
    }, []);

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
        <ScrollView
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
            }}
        >
            {state.transactions.filter((t) => t.status == constants.processed)
                .length > 0 && (
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
            <CreateSummary transactions={transactions} />
            <TransactionList
                state={state}
                setState={setState}
                transactions={transactions}
                filteredData={filteredData}
            />
        </ScrollView>
    );
};
export default TransactionsScreen;

const SummaryData = (transactions) => {
    const data = {
        incomes: [],
        expenses: [],
        totalExpenses: 0,
        totalIncomes: 0,
        result: 0,
    };
    let totalIncomes = 0;
    let totalExpenses = 0;

    defaultState.categories.forEach((category) => {
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((transaction) => {
            if (transaction.categoryId == category.id) {
                if (transaction.type == constants.income) {
                    totalIncome = +totalIncome + +transaction.amount;
                }
                if (transaction.type == constants.expense) {
                    totalExpense = +totalExpense + +transaction.amount;
                }
            }
        });
        if (totalIncome > 0) {
            data.incomes.push({
                category,
                totalIncome,
            });
        }
        if (totalExpense > 0) {
            data.expenses.push({
                category,
                totalExpense,
            });
        }

        totalIncomes = +totalIncomes + +totalIncome;
        totalExpenses = +totalExpenses + +totalExpense;
    });
    data.totalExpenses = totalExpenses;
    data.totalIncomes = totalIncomes;
    data.result = +totalIncomes - +totalExpenses;
    return data;
};

const CreateSummary = ({ transactions }) => {
    const [modal, setModal] = useState(false);

    const data = SummaryData(transactions);
    const height = 40;

    return (
        <>
            <Modal visible={modal} animationType={STYLES.animationType}>
                <ScrollView
                    style={{
                        flex: 1,
                        paddingTop: SIZES.statusBarHeight,
                        paddingHorizontal: SIZES.padding,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            height: SIZES.lineHeight,
                        }}
                    >
                        <GoBackArrow onPress={() => setModal(false)} />
                        <AppPageTitle title="Summary" />
                        <View style={{ width: 50 }}></View>
                    </View>
                    <Text
                        style={{
                            ...FONTS.h2,
                            height,
                            color: COLORS.lightgreen,
                        }}
                    >
                        Incomes:
                    </Text>
                    {data.incomes.map((income) => {
                        return (
                            <View
                                key={income.category.id}
                                style={{
                                    flexDirection: "row",
                                    height,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ flex: 1 }}>
                                    {income.category.name}
                                </Text>
                                <Text style={{ ...FONTS.h3 }}>
                                    {income.totalIncome}{" "}
                                </Text>
                                <Text style={{ color: COLORS.primary }}>
                                    {defaultState.currency.currenciesCode}
                                </Text>
                            </View>
                        );
                    })}
                    <AppDivider />
                    <View
                        style={{
                            flexDirection: "row",
                            height,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ flex: 1 }}>Total </Text>
                        <Text style={{ color: COLORS.green, ...FONTS.h3 }}>
                            {data.totalIncomes}{" "}
                        </Text>
                        <Text style={{ color: COLORS.primary }}>
                            {defaultState.currency.currenciesCode}
                        </Text>
                    </View>
                    <Text
                        style={{
                            ...FONTS.h2,
                            height,
                            color: COLORS.lightcoral,
                        }}
                    >
                        Expenses:
                    </Text>
                    {data.expenses.map((expense) => {
                        return (
                            <View
                                key={expense.category.id}
                                style={{
                                    flexDirection: "row",
                                    height,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ flex: 1 }}>
                                    {expense.category.name}
                                </Text>
                                <Text style={{ ...FONTS.h3 }}>
                                    {expense.totalExpense}{" "}
                                </Text>
                                <Text style={{ color: COLORS.primary }}>
                                    {defaultState.currency.currenciesCode}
                                </Text>
                            </View>
                        );
                    })}
                    <AppDivider />
                    <View
                        style={{
                            flexDirection: "row",
                            height,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ flex: 1 }}>Total </Text>
                        <Text style={{ color: COLORS.red, ...FONTS.h3 }}>
                            {data.totalExpenses}{" "}
                        </Text>
                        <Text style={{ color: COLORS.primary }}>
                            {defaultState.currency.currenciesCode}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            height,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ ...FONTS.h2, flex: 1 }}>
                            Difference:
                        </Text>
                        <Text style={{ ...FONTS.h3 }}>{data.result} </Text>
                        <Text style={{ color: COLORS.primary }}>
                            {defaultState.currency.currenciesCode}
                        </Text>
                    </View>
                </ScrollView>
            </Modal>
            <View
                style={{
                    flexDirection: "row",
                    ...STYLES.container,
                    ...STYLES.shadow,
                    margin: SIZES.padding,
                    alignItems: "center",
                }}
            >
                <Text style={{ flex: 1, ...FONTS.h2 }}>Summary</Text>

                <TouchableOpacity
                    onPress={() => {
                        setModal(true);
                    }}
                >
                    <FontAwesome name="list" size={25} color={COLORS.black} />
                </TouchableOpacity>
            </View>
        </>
    );
};

const TransactionList = ({ state, setState, transactions, filteredData }) => {
    const navigation = useNavigation();

    const displayMessage = () => {
        return state.transactions.length > 0
            ? "Transactions"
            : "No Transactions";
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
                                Total:{" "}
                                {
                                    state.transactions.filter(
                                        (t) => t.status == constants.processed
                                    ).length
                                }
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
                    {item.type != constants.transfer && (
                        <Image
                            source={category.icon}
                            style={{
                                width: 35,
                                height: 35,
                                tintColor: category.color,
                            }}
                        />
                    )}
                    <View style={{ flex: 1, marginLeft: SIZES.radius }}>
                        {item.type != constants.transfer && (
                            <Text style={{ ...FONTS.h3 }}>{category.name}</Text>
                        )}
                        {item.type == constants.transfer && (
                            <Text style={{ ...FONTS.h3 }}>Transfer</Text>
                        )}
                        {item.note != "" && (
                            <Text>{subString(item.note, 20)}</Text>
                        )}
                        {item.type == constants.transfer && (
                            <Text>
                                {getWalletNameById(item.fromAccountId)} {" -> "}
                                {getWalletNameById(item.toAccountId)}
                            </Text>
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
