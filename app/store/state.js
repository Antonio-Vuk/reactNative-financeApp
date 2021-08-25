import { currencyData } from "../utils/localStoredData";

var defaultState = {
    onBoard: false,
    token: undefined,
    user: undefined,
    transactions: [],
    categories: [],
    wallets: [],
    customFields: [],
    customFieldsListValues: [],
    customFieldsValues: [],
    currency: currencyData[56],
    loading: false,
};

const resetState = () => {
    defaultState.token = undefined;
    defaultState.user = undefined;
    defaultState.transactions = [];
    defaultState.wallets = [];
    defaultState.categories = [];
    defaultState.customFields = [];
    defaultState.customFieldsListValues = [];
    defaultState.customFieldsValues = [];
    defaultState.loading = false;
};

const saveDataLocalState = (result) => {
    defaultState.wallets = result.data.wallets;
    defaultState.categories = result.data.categories;
    defaultState.transactions = result.data.transactions;
    defaultState.customFields = result.data.customFields;
    defaultState.customFieldsListValues = result.data.customFieldsListValues;
    defaultState.customFieldsValues = result.data.customFieldsValues;
};

export { defaultState, resetState, saveDataLocalState };
