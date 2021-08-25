import { Alert } from "react-native";
import {
    deleteWalletSQLite,
    insertWalletSQLite,
    updateWalletSQLite,
    deleteTransactionsByWalletIdSQLite,
    deleteCustomFieldValuesByTransactionIdSQLite,
} from "../sqLite/sqliteFunctions";
import {
    deleteWalletLocalState,
    deleteWalletStateRest,
    insertWalletLocalState,
    updateWalletLocalState,
} from "../store/walletState";
import { successMessage } from "../utils/helpersFunctions";
import * as yup from "yup";
import { constants } from "../constants";
import { defaultState } from "../store/state";
import { deleteTransactionCustomFieldsValuesLocalState } from "../store/customFieldsState";
import {
    deleteWalletRest,
    insertWalletRest,
    updateWalletRest,
} from "../rest/wallet";
import { getWalletBallance } from "../utils/helpersFunctions";

const insertWalletController = async (wallet) => {
    let newWallet = undefined;
    if (defaultState.user == constants.offline) {
        newWallet = await insertWalletSQLite(
            wallet.name,
            wallet.ballance,
            wallet.color
        );
    } else {
        const result = await insertWalletRest(wallet);
        newWallet = result.data;
    }
    if (newWallet.id) {
        insertWalletLocalState(newWallet);
        successMessage("New wallet created!");
    }
};

const updateWalletController = async (wallet) => {
    let success = false;
    if (defaultState.user == constants.offline) {
        success = await updateWalletSQLite(wallet);
    } else {
        success = await updateWalletRest(wallet);
    }
    if (success) {
        updateWalletLocalState(wallet);
    }
    successMessage("Wallet edited!");
};

const deleteWalletController = async (id, name, ballance, callback) => {
    Alert.alert(
        "Delete",
        "Are you sure you want to delete Wallets: " +
            name +
            " with balance: " +
            getWalletBallance({ id, name, ballance }),
        [
            { text: "No" },
            {
                text: "Yes",
                onPress: async () => {
                    if (defaultState.user == constants.offline) {
                        await deleteWalletCustomFieldsValues(id);
                        await deleteTransactionsByWalletIdSQLite(id);
                        await deleteWalletSQLite(id);
                        deleteWalletLocalState(id);
                    } else {
                        const result = await deleteWalletRest(id);
                        if (result.data == true) {
                            deleteWalletStateRest(id);
                        }
                    }
                    callback();
                    successMessage("Wallet deleted!");
                },
            },
        ]
    );
};

const deleteWalletCustomFieldsValues = async (walletId) => {
    const transactions = defaultState.transactions.filter(
        (transaction) =>
            transaction.toAccountId == walletId ||
            transaction.fromAccountId == walletId
    );

    transactions.forEach(async (transaction) => {
        if (defaultState.user == constants.offline) {
            await deleteCustomFieldValuesByTransactionIdSQLite(transaction.id);
        }
        deleteTransactionCustomFieldsValuesLocalState(transaction.id);
    });
};

const walletSchema = yup.object().shape({
    name: yup.string().required().label("Name").typeError("Name is required!"),
    ballance: yup
        .number()
        .required("required")
        .integer()
        .label("Ballance")
        .typeError("Balance is required and must be numeric!"),
    color: yup
        .string()
        .required()
        .label("Color")
        .typeError("Color is required!"),
});

export {
    insertWalletController,
    updateWalletController,
    deleteWalletController,
    walletSchema,
};
