import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    Image,
    FlatList,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { AppDivider, AppPageTitle, GoBackArrow } from "../components";
import { createTables, dropTables } from "../sqLite/SQLiteDB";
import { SIZES, icons, STYLES, FONTS, COLORS, constants } from "../constants";
import { defaultState, resetState } from "../store/state";
import { currencyData } from "../utils/localStoredData";
import {
    MaterialCommunityIcons,
    AntDesign,
    FontAwesome,
    MaterialIcons,
} from "@expo/vector-icons";
import {
    showError,
    subString,
    successMessage,
} from "../utils/helpersFunctions";
import { AppContext } from "../contexts";
import { importData, exportData } from "../utils/excelFunctions";
import { KEYS, loadStorageData, storeData } from "../storage";
import routes from "../navigation/routes";
import { deleteUserDataRest, importDataRest } from "../rest/data";

const SettingsScreen = ({ navigation }) => {
    const { state, setState } = useContext(AppContext);
    const [currency, setCurrency] = useState(state.currency);

    return (
        <View
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
                paddingHorizontal: SIZES.padding,
            }}
        >
            <ScrollView>
                <View style={{ paddingBottom: SIZES.padding }}>
                    <AppPageTitle title="More" />
                </View>
                <Text style={{ padding: SIZES.base, ...FONTS.h4 }}>
                    {defaultState.user == constants.offline
                        ? "Offline mode"
                        : defaultState.user.email}
                </Text>
                <View style={STYLES.container}>
                    <SelectLanguageModal
                        currency={currency}
                        setCurrency={setCurrency}
                        setState={setState}
                    />
                    <AppDivider />
                    <MainMenuListItem
                        children={
                            <AntDesign
                                name="wallet"
                                size={SIZES.icon}
                                color={COLORS.black}
                            />
                        }
                        text="Wallets"
                        onPress={() => navigation.navigate(routes.wallets)}
                    />
                    <AppDivider />
                    <MainMenuListItem
                        children={
                            <MaterialIcons
                                name="category"
                                size={SIZES.icon}
                                color={COLORS.black}
                            />
                        }
                        text="Categories"
                        onPress={() => navigation.navigate(routes.categories)}
                    />
                    <AppDivider />
                    <MainMenuListItem
                        children={
                            <MaterialIcons
                                name="category"
                                size={SIZES.icon}
                                color={COLORS.black}
                            />
                        }
                        text="Custom fields"
                        onPress={() => navigation.navigate(routes.customFields)}
                    />
                    <AppDivider />
                    <MainMenuListItem
                        children={
                            <MaterialCommunityIcons
                                name={icons.excelExport}
                                size={30}
                                color="black"
                            />
                        }
                        text="Export data to excel"
                        onPress={() => exportData(state, setState)}
                    />
                    <AppDivider />
                    <MainMenuListItem
                        children={
                            <MaterialCommunityIcons
                                name={icons.excelImport}
                                size={30}
                                color="black"
                            />
                        }
                        text="Import data from excel"
                        onPress={() => importData(state, setState)}
                    />
                    {true && (
                        <>
                            <AppDivider />
                            <MainMenuListItem
                                text="Reset everything"
                                onPress={async () => {
                                    try {
                                        dropTables();
                                        createTables();
                                        if (
                                            defaultState.user !=
                                            constants.offline
                                        ) {
                                            await deleteUserDataRest();
                                        }
                                        await storeData(
                                            KEYS.currency,
                                            JSON.stringify(currencyData[56])
                                        );
                                        await storeData(KEYS.token, "");
                                        await storeData(
                                            KEYS.user,
                                            constants.offline
                                        );

                                        resetState();
                                        await storeData(KEYS.onBoarding, false);
                                        defaultState.onBoard = false;

                                        setState({ ...defaultState });
                                    } catch (error) {
                                        showError(error);
                                    }
                                }}
                            />
                        </>
                    )}
                    {defaultState.user == constants.offline && (
                        <>
                            <AppDivider />
                            <MainMenuListItem
                                text="Register"
                                onPress={() => {
                                    navigation.navigate(routes.register, {
                                        callback: async () => {
                                            let data = {
                                                wallets: defaultState.wallets,
                                                categories:
                                                    defaultState.categories,
                                                transactions:
                                                    defaultState.transactions,
                                                customFields:
                                                    defaultState.customFields,
                                                customFieldsListValues:
                                                    defaultState.customFieldsListValues,
                                                customFieldsValues:
                                                    defaultState.customFieldsValues,
                                            };
                                            await importDataRest(data);
                                            successMessage(
                                                "Data imported successfuly!"
                                            );
                                            navigation.goBack();
                                        },
                                    });
                                }}
                            />
                        </>
                    )}
                    {defaultState.user != constants.offline && (
                        <>
                            <AppDivider />
                            <MainMenuListItem
                                text="Log out"
                                onPress={async () => {
                                    await storeData(KEYS.token, "");
                                    await storeData(
                                        KEYS.user,
                                        constants.offline
                                    );
                                    await loadStorageData();
                                    resetState();
                                    defaultState.import = true;
                                    setState({ ...defaultState });
                                }}
                            />
                        </>
                    )}
                </View>
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

export default SettingsScreen;

const SelectLanguageModal = ({ currency, setCurrency, setState }) => {
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState("");

    return (
        <>
            <MainMenuListItem
                children={
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                        }}
                        source={{ uri: currency.flag }}
                    />
                }
                text={currency.currenciesName}
                onPress={() => setModal(true)}
            />

            <Modal visible={modal} animationType={STYLES.animationType}>
                <View
                    style={{
                        paddingTop: SIZES.statusBarHeight,
                        paddingHorizontal: SIZES.padding,
                    }}
                >
                    <FlatList
                        ListHeaderComponent={
                            <>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        height: SIZES.lineHeight,
                                        marginBottom: SIZES.base,
                                    }}
                                >
                                    <GoBackArrow
                                        onPress={() => setModal(false)}
                                    />
                                    <AppPageTitle title="Select Currency" />
                                    <View style={{ width: 50 }}></View>
                                </View>
                                <SearchBox
                                    search={search}
                                    setSearch={setSearch}
                                />
                            </>
                        }
                        data={currencyData.filter(
                            (item) =>
                                item.country
                                    .toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                item.currenciesName
                                    .toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                item.currenciesCode
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={(item) =>
                            renderCountryItem(
                                item,
                                setModal,
                                currency,
                                setCurrency,
                                setSearch,
                                setState
                            )
                        }
                        ItemSeparatorComponent={() => <AppDivider />}
                    />
                </View>
            </Modal>
        </>
    );
};

const MainMenuListItem = ({ children, text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{
                    flexDirection: "row",
                    height: SIZES.lineHeight,
                    alignItems: "center",
                }}
            >
                {children && (
                    <View
                        style={{
                            height: "100%",
                            width: 30,
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}
                    >
                        {children}
                    </View>
                )}
                <Text
                    style={{
                        ...FONTS.body3,
                        flex: 1,
                        alignItems: "center",
                        paddingLeft: 10,
                    }}
                >
                    {text}
                </Text>
                <AntDesign name="right" size={24} color="black" />
            </View>
        </TouchableOpacity>
    );
};

const renderCountryItem = (
    { item },
    setModal,
    currency,
    setCurrency,
    setSearch,
    setState
) => {
    return (
        <TouchableOpacity
            onPress={async () => {
                let curr = JSON.stringify(item);
                storeData(KEYS.currency, curr);
                defaultState.currency = item;
                setState({ ...defaultState });
                setCurrency(item);
                setSearch("");
                setModal(false);
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    height: SIZES.lineHeight,
                    alignItems: "center",
                    backgroundColor:
                        currency.id == item.id ? "lightgray" : "white",
                }}
            >
                <Image
                    style={{ width: 40, height: 40 }}
                    source={{ uri: item.flag }}
                />
                <Text
                    style={{
                        flex: 1,
                        left: 10,
                        flexWrap: "wrap",
                        ...FONTS.body3,
                    }}
                >
                    {subString(item.country) +
                        " - " +
                        subString(item.currenciesName, 20)}
                </Text>
                <Text style={{ ...FONTS.h3 }}>{item.currenciesCode}</Text>
            </View>
        </TouchableOpacity>
    );
};

const SearchBox = ({ search, setSearch }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                height: SIZES.lineHeight,
                borderRadius: 10,
                borderWidth: 1,
                alignItems: "center",
            }}
        >
            <View
                style={{
                    height: "100%",
                    justifyContent: "center",
                    paddingLeft: 10,
                }}
            >
                <FontAwesome name="search" size={25} color="black" />
            </View>
            <TextInput
                placeholder="Search text"
                style={{
                    flex: 1,
                    height: "90%",
                    ...FONTS.body3,
                    paddingLeft: 10,
                }}
                value={search}
                onChangeText={(text) => setSearch(text)}
                autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setSearch("")}>
                <View
                    style={{
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        width: 50,
                        paddingRight: 10,
                    }}
                >
                    <FontAwesome name="remove" size={25} color="black" />
                </View>
            </TouchableOpacity>
        </View>
    );
};
