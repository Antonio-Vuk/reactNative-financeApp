import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SIZES, COLORS, constants, FONTS, STYLES } from "../constants";
import { AppContext } from "../contexts";
import victoryTheme from "../constants/victoryTheme";
import { AppDivider, Screen } from "../components";
import { VictoryScatter, VictoryLine, VictoryChart } from "victory-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { totalBalance, getWalletBallance } from "../utils/helpersFunctions";
const TestScreen = () => {
    const { state } = useContext(AppContext);
    const [data, setData] = useState();
    const [wallet, setWallet] = useState(constants.all);
    const [time, setTime] = useState("7 days");

    const timeArray = ["7 days", "2 weeks", "1 month", "3 months"];

    useEffect(() => {
        getChartData(state, setData, wallet, time);
    }, [wallet, state, time]);

    return (
        <Screen>
            <View
                style={{
                    backgroundColor: "white",
                    marginHorizontal: SIZES.padding,
                    borderRadius: 30,
                }}
            >
                <WalletSelector
                    wallet={wallet}
                    setWallet={setWallet}
                    state={state}
                ></WalletSelector>
                <Chart data={data}></Chart>
                <TimeSelector
                    timeArray={timeArray}
                    setTime={setTime}
                    time={time}
                ></TimeSelector>
            </View>

            <View
                style={{
                    marginVertical: SIZES.padding,
                    paddingVertical: SIZES.padding,
                    backgroundColor: "white",
                    marginHorizontal: SIZES.padding,
                    borderRadius: 30,
                }}
            >
                <StatisticDetails state={state} wallet={wallet} time={time} />
            </View>
        </Screen>
    );
};

const StatisticDetails = ({ state, wallet, time }) => {
    const wallets = state.wallets.filter((item) => item.name == wallet);
    const wall = wallets[0];

    return (
        <>
            <View
                style={{
                    height: 40,
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Text
                    style={{
                        paddingHorizontal: SIZES.padding,
                        ...FONTS.h2,
                    }}
                >
                    {wallet == constants.all ? "Total incomes:" : "Incomes: "}
                </Text>
                <Text
                    style={{
                        ...FONTS.h2,
                        color: COLORS.green,
                    }}
                >
                    {wallet == constants.all
                        ? totalIncomes(state, time)
                        : getWalletDetails(wall, state, time).incomes}
                </Text>
            </View>
            <View
                style={{
                    height: 40,
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Text
                    style={{
                        paddingHorizontal: SIZES.padding,
                        ...FONTS.h2,
                    }}
                >
                    {wallet == constants.all ? "Total expenses:" : "Expenses: "}
                </Text>
                <Text
                    style={{
                        ...FONTS.h2,
                        color: COLORS.red,
                    }}
                >
                    {wallet == constants.all
                        ? totalExpenses(state, time)
                        : getWalletDetails(wall, state, time).expenses}
                </Text>
            </View>
        </>
    );
};
const getWalletDetails = (wallet, state, time) => {
    let expenses = 0;
    let incomes = 0;

    let transactions = state.transactions.filter(
        (item) =>
            item.toAccountId == wallet.id || item.fromAccountId == wallet.id
    );

    transactions = filterTransactionsByDate(transactions, time);

    transactions.forEach((t) => {
        if (t.toAccountId == wallet.id) {
            incomes = +incomes + +t.amount;
        }
        if (t.fromAccountId == wallet.id) {
            expenses = +expenses + +t.amount;
        }
    });
    return { expenses, incomes, ballance: +incomes - +expenses };
};

const totalExpenses = (state, time) => {
    let total = 0;
    let transactions = state.transactions;

    transactions = filterTransactionsByDate(transactions, time);
    transactions.forEach((transaction) => {
        if (transaction.type == constants.expense) {
            total = +total + +transaction.amount;
        }
    });
    return total;
};
const totalIncomes = (state, time) => {
    let total = 0;

    let transactions = state.transactions;

    transactions = filterTransactionsByDate(transactions, time);
    transactions.forEach((transaction) => {
        if (transaction.type == constants.income) {
            total = +total + +transaction.amount;
        }
    });
    return total;
};

const TimeSelector = ({ timeArray, setTime, time }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {timeArray.map((item) => (
                <TouchableOpacity
                    key={item}
                    style={{
                        backgroundColor:
                            item == time ? COLORS.primary : COLORS.lightGray,
                        margin: SIZES.padding,
                        paddingHorizontal: 15,
                        paddingVertical: SIZES.base,
                        borderRadius: 50,
                    }}
                    onPress={() => {
                        setTime(item);
                    }}
                >
                    <Text
                        style={{
                            color: item == time ? COLORS.white : COLORS.black,
                            ...FONTS.h4,
                        }}
                    >
                        {item}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const filterTransactionsByDate = (transactions, time) => {
    var d = new Date();

    if (time == "7 days") {
        d.setDate(d.getDate() - 7);
        transactions = transactions.filter((a) => new Date(a.date) > d);
    } else if (time == "2 weeks") {
        d.setDate(d.getDate() - 14);
        transactions = transactions.filter((a) => new Date(a.date) > d);
    } else if (time == "1 month") {
        d.setDate(d.getDate() - 30);
        transactions = transactions.filter((a) => new Date(a.date) > d);
    }

    return transactions;
};

const getChartData = (state, setData, wallet, time) => {
    let initialBalance = 0;
    let selectedWallet = {};
    if (wallet == constants.all) {
        state.wallets.forEach((wallet) => {
            initialBalance = +initialBalance + +wallet.ballance;
        });
    } else {
        let wallets = state.wallets.filter((item) => item.name == wallet);
        selectedWallet = wallets[0];
        initialBalance = selectedWallet.ballance;
    }
    let transactions = [];

    if (wallet == constants.all) {
        transactions = state.transactions;
    } else {
        transactions = state.transactions.filter(
            (a) =>
                a.toAccountId == selectedWallet.id ||
                a.fromAccountId == selectedWallet.id
        );
    }

    transactions = filterTransactionsByDate(transactions, time);

    transactions = transactions.sort((a, b) => {
        return new Date(a.date) > new Date(b.date);
    });
    let newData = [];
    transactions.forEach((transaction) => {
        if (wallet == constants.all) {
            if (transaction.type == constants.income) {
                initialBalance = +initialBalance + +transaction.amount;
            }
            if (transaction.type == constants.expense) {
                initialBalance = +initialBalance - +transaction.amount;
            }
        } else {
            if (transaction.toAccountId == selectedWallet.id) {
                initialBalance = +initialBalance + +transaction.amount;
            }
            if (transaction.fromAccountId == selectedWallet.id) {
                initialBalance = +initialBalance - +transaction.amount;
            }
        }
        newData.push(initialBalance);
    });
    let myData = [];
    newData.forEach((d, index) => {
        myData.push({
            x: index + 1,
            y: d,
        });
    });
    setData(myData);
};

const getWallChartWallet = (state) => {
    let walletsNames = [];
    walletsNames.push("All");
    state.wallets.forEach((wallet) => {
        walletsNames.push(wallet.name);
    });
    return walletsNames;
};

const WalletSelector = ({ wallet, setWallet, state }) => {
    return (
        <ScrollView horizontal>
            {getWallChartWallet(state).map((item) => (
                <TouchableOpacity
                    key={item}
                    style={{
                        backgroundColor:
                            item == wallet ? COLORS.primary : COLORS.lightGray,
                        margin: SIZES.padding,
                        paddingHorizontal: 20,
                        paddingVertical: SIZES.base,
                        borderRadius: 50,
                    }}
                    onPress={() => {
                        setWallet(item);
                    }}
                >
                    <Text
                        style={{
                            color: item == wallet ? COLORS.white : COLORS.black,
                            ...FONTS.h4,
                        }}
                    >
                        {item}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const Chart = ({ data }) => {
    return (
        <VictoryChart theme={victoryTheme}>
            <VictoryLine
                style={{
                    data: {
                        stroke: COLORS.primary,
                    },
                }}
                data={data}
            ></VictoryLine>
            <VictoryScatter
                data={data}
                size={5}
                style={{
                    data: {
                        fill: COLORS.primary,
                    },
                }}
            ></VictoryScatter>
        </VictoryChart>
    );
};

export default TestScreen;
