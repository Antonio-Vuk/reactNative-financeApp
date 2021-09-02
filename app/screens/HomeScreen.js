import React, { useContext } from "react";
import {
    ImageBackground,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { AppContext } from "../contexts";
import { COLORS, FONTS, icons, images, SIZES, STYLES } from "../constants";
import { FontAwesome } from "@expo/vector-icons";
import routes from "../navigation/routes";
import { PieChartCategoryes } from "../components";
import { useNavigation } from "@react-navigation/core";
import {
    ballanceLast24Hours,
    totalBalance,
    getWalletBallance,
} from "../utils/helpersFunctions";
import { unSetFieldsValuesLocalState } from "../store/customFieldsState";
import { defaultState } from "../store/state";

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
                <RenderIncomingTransactions setState={setState} />
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const RenderIncomingTransactions = ({ setState }) => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                ...STYLES.container,
                ...STYLES.shadow,
                margin: SIZES.padding,
            }}
        >
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
