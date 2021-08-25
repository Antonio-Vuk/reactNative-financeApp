import React, { useContext } from "react";
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

import { AppDivider, DeleteActionsSwipeable } from "../components";
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

const TransactionsScreen = () => {
    return (
        <View
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
            }}
        >
            <TransactionList />
        </View>
    );
};
export default TransactionsScreen;

const TransactionList = () => {
    const { state, setState } = useContext(AppContext);
    const navigation = useNavigation();

    return (
        <ScrollView>
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
                                {state.transactions.length > 0
                                    ? "All transactions"
                                    : "No Transactions"}
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
                data={state.transactions.sort((a, b) => {
                    return new Date(a.date) < new Date(b.date);
                })}
                renderItem={(item) =>
                    RenderListItem(item, state, setState, navigation)
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
        </ScrollView>
    );
};

const RenderListItem = ({ item }, state, setState, navigation) => {
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
