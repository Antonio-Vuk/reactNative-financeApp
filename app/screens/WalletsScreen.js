import React, { useContext } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Text,
} from "react-native";
import { SIZES, COLORS, STYLES, FONTS, icons, constants } from "../constants";
import { AppContext } from "../contexts";
import {
    AppDivider,
    DeleteActionsSwipeable,
    GoBackArrow,
    PageTitle,
} from "../components";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import routes from "../navigation/routes";
import { defaultState } from "../store/state";
import { deleteWalletController } from "../controllers/walletController";
import { showError } from "../utils/helpersFunctions";

const WalletsScreen = ({ navigation }) => {
    const { state, setState } = useContext(AppContext);
    const onDeletePress = (item) => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }
        try {
            deleteWalletController(item.id, item.name, item.ballance, () => {
                setState({ ...defaultState });
            });
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
            }}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: SIZES.padding }}>
                    <GoBackArrow text={true} />
                    <View
                        style={{
                            paddingVertical: SIZES.padding,
                            flexDirection: "row",
                        }}
                    >
                        <PageTitle title={"Wallets: " + state.wallets.length} />
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(routes.wallet, {
                                    editMode: false,
                                })
                            }
                            style={{
                                flex: 1,
                                alignItems: "flex-end",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesome
                                name="plus"
                                size={30}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <WalletsList
                    state={state}
                    navigation={navigation}
                    onDeletePress={onDeletePress}
                />
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const WalletsList = ({ state, navigation, onDeletePress }) => {
    const renderItem = ({ item }) => {
        const getColor = ({ ballance }) => {
            if (ballance > 0) {
                return COLORS.green;
            } else if (item.ballance < 0) {
                return COLORS.red;
            } else return COLORS.gray;
        };
        return (
            <DeleteActionsSwipeable onPress={() => onDeletePress(item)}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(routes.wallet, {
                            editMode: true,
                            wallet: item,
                        });
                    }}
                    style={{
                        height: SIZES.lineHeight,
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: SIZES.base,
                    }}
                >
                    <Text
                        style={{
                            paddingLeft: SIZES.padding,
                            ...FONTS.body2,
                            flex: 1,
                        }}
                    >
                        {item.name}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.h3,
                            color: getColor(item),
                        }}
                    >
                        {item.ballance} {state.currency.currenciesCode}
                    </Text>
                    <AntDesign
                        name={icons.foward}
                        size={30}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </DeleteActionsSwipeable>
        );
    };
    return (
        <>
            {state.wallets.length > 0 && (
                <FlatList
                    data={state.wallets}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={(item) => renderItem(item)}
                    ItemSeparatorComponent={() => <AppDivider />}
                    contentContainerStyle={{
                        margin: SIZES.padding,
                        ...STYLES.container,
                        ...STYLES.shadow,
                    }}
                />
            )}
        </>
    );
};

export default WalletsScreen;
