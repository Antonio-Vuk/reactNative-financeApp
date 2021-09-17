import { COLORS, constants } from "../constants";
import { defaultState } from "../store/state";
import { showMessage } from "react-native-flash-message";

// Category
const getCategory = (id) => {
    var category = defaultState.categories.filter((item) => item.id == id);
    if (category.length > 0) {
        return category[0];
    }
    return "";
};

const getCategoryHF = (type = constants.income) => {
    const categories = defaultState.categories.filter(
        (category) => category.type == type || category.type == constants.both
    );
    if (categories.length > 0) {
        return categories[0].id;
    }
    return undefined;
};

const numberOfCategoryes = (type) => {
    return defaultState.categories.filter(
        (item) => item.type == type || item.type == "both"
    ).length;
};

// Transaction
const getTransaction = (id) => {
    const transactions = defaultState.transactions.filter(
        (transaction) => transaction.id == id
    );
    if (transactions.length > 0) {
        return transactions[0];
    } else
        return {
            amount: "",
            categoryId: undefined,
            date: new Date(),
            note: "",
            toAccountId: undefined,
            fromAccountId: undefined,
            type: constants.income,
        };
};

// Wallet
const getWalletById = (id) => {
    var arrayWallet = defaultState.wallets.filter((item) => item.id == id);
    if (arrayWallet.length > 0) {
        var wallet = arrayWallet[0];
        return wallet;
    }
    return {};
};

const getWalletNameById = (id) => {
    var arrayWallet = defaultState.wallets.filter((item) => item.id == id);
    if (arrayWallet.length > 0) {
        var wallet = arrayWallet[0];
        return wallet.name;
    }
    return "-";
};

const getDifferentWalletById = (id) => {
    var arrayWallet = defaultState.wallets.filter((item) => item.id != id);
    var wallet = arrayWallet[0];
    return wallet;
};

const getWalletBallanceById = (walletId) => {
    const index = defaultState.wallets.findIndex((item) => item.id == walletId);
    return defaultState.wallets[index].ballance;
};

const ballanceLast24Hours = () => {
    var today = new Date();
    today.setHours(today.getHours() - 24);
    let ballance = 0;

    const transactions = defaultState.transactions.filter(
        (transaction) => new Date(transaction.date) > today
    );
    transactions.forEach((transaction) => {
        if (transaction.status == constants.processed) {
            if (transaction.type == constants.income) {
                ballance = +ballance + +transaction.amount;
            }
            if (transaction.type == constants.expense) {
                ballance = +ballance - +transaction.amount;
            }
        }
    });
    return ballance;
};
const totalBalance = (state) => {
    let sum = 0;
    state.wallets.forEach((wallet) => {
        sum += +getWalletBallance(wallet);
    });
    return sum;
};

const getWalletBallance = (wallet) => {
    let initialBallance = wallet.ballance;
    defaultState.transactions.forEach((transaction) => {
        if (transaction.status == constants.processed) {
            if (transaction.type == constants.income) {
                if (transaction.toAccountId == wallet.id) {
                    initialBallance = +initialBallance + +transaction.amount;
                }
            }
            if (transaction.type == constants.expense) {
                if (transaction.fromAccountId == wallet.id) {
                    initialBallance = +initialBallance - +transaction.amount;
                }
            }
            if (transaction.type == constants.transfer) {
                if (transaction.fromAccountId == wallet.id) {
                    initialBallance = +initialBallance - +transaction.amount;
                }
                if (transaction.toAccountId == wallet.id) {
                    initialBallance = +initialBallance + +transaction.amount;
                }
            }
        }
    });
    return initialBallance;
};

// CustomFields
const getCustomFieldById = (id) => {
    const custom = defaultState.customFields.filter((el) => el.id == id);
    return custom[0];
};

const getCustomFieldListValue = (id) => {
    const value = defaultState.customFieldsListValues.filter(
        (el) => el.id == id
    );
    return value[0].value;
};

const getCustomFiledType = (id) => {
    if (id == "1") {
        return "Number";
    }
    if (id == "2") {
        return "Text";
    }
    if (id == "3") {
        return "Date";
    }
    if (id == "4") {
        return "List";
    }
};

// Generin methods

const subString = (rijec, num = 10) => {
    if (rijec.length < num) {
        return rijec;
    } else {
        var str = rijec;
        var res = str.substr(0, num);
        return res + "..";
    }
};

const getColorByType = (type) => {
    if (type == constants.income) {
        return COLORS.green;
    } else if (type == constants.expense) {
        return COLORS.red;
    } else {
        return COLORS.gray;
    }
};

function generateId() {
    return "xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const successMessage = (message) => {
    showMessage({
        message: "Success",
        description: message,
        type: "success",
    });
};

const errorMessage = (message) => {
    showMessage({
        message: "Error",
        description: message,
        type: "danger",
    });
};

const showError = (error) => {
    if (error.response == undefined) {
        showMessage({
            message: "Error",
            description: error.message ? error.message : error,
            type: "danger",
        });
    } else {
        showMessage({
            message: "Error",
            description:
                error.response.data != undefined
                    ? error.response.data
                    : error.message,
            type: "danger",
        });
    }
};

function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

export {
    getCategoryHF,
    getCategory,
    numberOfCategoryes,
    getTransaction,
    getWalletById,
    getWalletBallanceById,
    getWalletNameById,
    getDifferentWalletById,
    ballanceLast24Hours,
    getCustomFieldById,
    getCustomFieldListValue,
    getCustomFiledType,
    subString,
    getColorByType,
    generateId,
    successMessage,
    errorMessage,
    showError,
    isNumeric,
    totalBalance,
    getWalletBallance,
};
