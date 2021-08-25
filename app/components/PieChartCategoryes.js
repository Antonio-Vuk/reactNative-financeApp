import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { VictoryPie } from "victory-native";
import { constants, SIZES, STYLES, FONTS, COLORS, icons } from "../constants";
import { AppContext } from "../contexts";
import { FontAwesome } from "@expo/vector-icons";

const PieChartCategoryes = () => {
    const { state, setState } = useContext(AppContext);
    const [category, setCategory] = useState();
    const [categoryType, setCategoryType] = useState(constants.income);
    const [chartData, setChartData] = useState(
        processCategoryDataToDisplay(state, categoryType)
    );
    const [colorScale, setColorScale] = useState(
        chartData.map((item) => item.color)
    );
    const [totalExpenseCount, setTotalExpenseCount] = useState(
        chartData.reduce((a, b) => a + (b.expenseCount || 0), 0)
    );
    const [total, setTotal] = useState(
        chartData.reduce((a, b) => +a + (+b.y || 0), 0)
    );
    useEffect(() => {
        setChartData(processCategoryDataToDisplay(state, categoryType));
        setColorScale(
            processCategoryDataToDisplay(state, categoryType).map(
                (item) => item.color
            )
        );
        setTotalExpenseCount(
            processCategoryDataToDisplay(state, categoryType).reduce(
                (a, b) => a + (b.expenseCount || 0),
                0
            )
        );
        setTotal(
            processCategoryDataToDisplay(state, categoryType).reduce(
                (a, b) => a + (b.y || 0),
                0
            )
        );
    }, [state.transactions, categoryType]);
    return (
        <View
            style={{
                marginTop: 10,
                marginHorizontal: SIZES.padding,
                ...STYLES.container,
                ...STYLES.shadow,
            }}
        >
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3 }}>Categories</Text>
                    <Text style={{ ...FONTS.body3, color: COLORS.gray }}>
                        {state.categories.length} Total
                    </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            setCategoryType(constants.income);
                            setCategory(undefined);
                        }}
                        style={{
                            height: SIZES.lineHeight,
                            width: SIZES.lineHeight,
                            backgroundColor:
                                categoryType == constants.income
                                    ? COLORS.green
                                    : COLORS.white,
                            borderRadius: SIZES.lineHeight / 2,
                            marginRight: SIZES.padding,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <FontAwesome
                            name={icons.plus}
                            size={SIZES.icon}
                            color={
                                categoryType == constants.income
                                    ? COLORS.white
                                    : COLORS.black
                            }
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setCategoryType(constants.expense);
                            setCategory(undefined);
                        }}
                        style={{
                            height: SIZES.lineHeight,
                            width: SIZES.lineHeight,
                            backgroundColor:
                                categoryType == constants.expense
                                    ? COLORS.red
                                    : COLORS.white,
                            borderRadius: SIZES.lineHeight / 2,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <FontAwesome
                            name={icons.minus}
                            size={SIZES.icon}
                            color={
                                categoryType == constants.expense
                                    ? COLORS.white
                                    : COLORS.black
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                {chartData.length > 0 && (
                    <VictoryPie
                        data={chartData}
                        colorScale={colorScale}
                        width={SIZES.windowWidth * 0.8}
                        height={SIZES.windowWidth * 0.8}
                        labelRadius={({ innerRadius }) =>
                            (SIZES.windowWidth * 0.4 + innerRadius) / 2.5
                        }
                        style={{
                            labels: {
                                fill: COLORS.black,
                                fontWeight: "bold",
                                fontSize: 15,
                            },
                            parent: {
                                ...STYLES.shadow,
                            },
                        }}
                        innerRadius={70}
                        radius={({ datum }) => {
                            return category && category.id == datum.id.id
                                ? SIZES.windowWidth * 0.4
                                : SIZES.windowWidth * 0.4 - 10;
                        }}
                        events={[
                            {
                                target: "data",
                                eventHandlers: {
                                    onPress: () => {
                                        return [
                                            {
                                                target: "labels",
                                                mutation: (props) => {
                                                    let category =
                                                        chartData[props.index]
                                                            .id;
                                                    setCategory(category);
                                                },
                                            },
                                        ];
                                    },
                                },
                            },
                        ]}
                    />
                )}
                <View style={{ position: "absolute", top: "40%", left: "43%" }}>
                    {category != undefined && (
                        <>
                            <Image
                                source={category.icon}
                                style={{
                                    height: 60,
                                    width: 60,
                                    tintColor: category.color,
                                }}
                            ></Image>
                            <Text
                                style={{
                                    color: category.color,
                                    ...FONTS.h3,
                                }}
                            >
                                {category.name}
                            </Text>
                        </>
                    )}
                </View>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ ...FONTS.h3 }}>
                    {categoryType == constants.income
                        ? "Incomes: "
                        : "Expenses: "}
                </Text>
                <Text style={{ ...FONTS.body3 }}>{totalExpenseCount}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ textAlign: "center", ...FONTS.h3 }}>
                    Total:{" "}
                </Text>
                <Text style={{ textAlign: "center", ...FONTS.body3 }}>
                    {total}
                </Text>
            </View>
        </View>
    );
};

const processCategoryDataToDisplay = (state, categoryType) => {
    let chartData = state.categories
        .filter(
            (item) => item.type == categoryType || item.type == constants.both
        )
        .map((category) => {
            let transactions = state.transactions.filter(
                (item) =>
                    item.categoryId == category.id && item.type == categoryType
            );

            var total = transactions.reduce((a, b) => a + (b.amount || 0), 0);

            return {
                name: category.name,
                y: total,
                expenseCount: transactions.length,
                color: category.color,
                id: category,
            };
        });

    let filterChartData = chartData.filter((a) => a.y > 0);
    let totalExpense = filterChartData.reduce((a, b) => a + (b.y || 0), 0);

    let finalChartData = filterChartData.map((item) => {
        let percentage = ((item.y / totalExpense) * 100).toFixed(0);
        return {
            label: `${percentage}%`,
            y: Number(item.y),
            expenseCount: item.expenseCount,
            color: item.color,
            name: item.name,
            id: item.id,
        };
    });

    return finalChartData;
};

export default PieChartCategoryes;
