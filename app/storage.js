import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "./constants";
import { defaultState } from "./store/state";
import { currencyData } from "./utils/localStoredData";

const KEYS = {
    onBoarding: "OnBoarding",
    user: "User",
    token: "Token",
    currency: "currency",
};

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
        console.log(error);
    }
};
const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error) {
        console.log(error);
    }
};
const storeDataAsJSON = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.log(error);
    }
};

const getDataFromJSON = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.log(error);
    }
};

const loadStorageData = async () => {
    const onBoardData = await getData(KEYS.onBoarding);
    defaultState.onBoard = onBoardData;

    const _currency = await getData(KEYS.currency);

    defaultState.currency = currencyData[56];

    if (_currency != undefined) {
        let currency = JSON.parse(_currency);
        defaultState.currency = currency;
    }

    const _user = await getData(KEYS.user);
    defaultState.user = undefined;
    if (_user != undefined && _user != constants.offline) {
        const user = JSON.parse(_user);
        defaultState.user = user;
    } else {
        defaultState.user = _user;
    }

    const token = await getData(KEYS.token);
    defaultState.token = token;
};

export {
    storeData,
    storeDataAsJSON,
    getData,
    getDataFromJSON,
    KEYS,
    loadStorageData,
};
