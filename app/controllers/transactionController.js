import * as yup from "yup";
import {
    createTransactionSQLite,
    updateTransactionSQLite,
    deleteCustomFieldValuesByTransactionIdSQLite,
    deleteTransactionSQLite,
} from "../sqLite/sqliteFunctions";

import {
    createCustomFieldsValuesController,
    createFeaturedCustomFieldsValuesController,
} from "./customFieldsController";
import {
    deleteTransactionState,
    insertTransactionState,
    updateTransactionState,
} from "../store/transactionState";
import { constants } from "../constants";
import { defaultState } from "../store/state";
import {
    saveTransactionCustomFieldsLocalState,
    updateTransactionCustomFieldsLocalState,
    unSetFieldsValuesLocalState,
    deleteTransactionCustomFieldsValuesLocalState,
} from "../store/customFieldsState";
import { successMessage } from "../utils/helpersFunctions";
import { Alert } from "react-native";
import {
    deleteTransactionRest,
    insertIncomingTransactionRest,
    insertTransactionRest,
    updateTransactionRest,
} from "../rest/transaction";
import { uploadImagesToFirebase } from "../firebase";

const createFuturedTransactionController = async (_transaction) => {
    const transaction = await setAndValidate(_transaction);

    if (defaultState.user == constants.offline) {
        let newTransaction = await createTransactionSQLite(transaction);
        insertTransactionState(newTransaction);

        let customs = defaultState.customFieldsValues.filter(
            (custom) => custom.transactionId == _transaction.id
        );
        customs.forEach((custom) => {
            custom.transactionId = newTransaction.id;
        });

        const newCustomFieldsValues =
            await createFeaturedCustomFieldsValuesController(customs);

        saveTransactionCustomFieldsLocalState(newCustomFieldsValues);
    } else {
        let customs = defaultState.customFieldsValues.filter(
            (custom) => custom.transactionId == _transaction.id
        );
        const result = await insertIncomingTransactionRest(
            transaction,
            customs
        );

        if (result.data) {
            defaultState.transactions.push(result.data.transaction);
            defaultState.customFieldsValues =
                defaultState.customFieldsValues.concat(
                    result.data.customFieldValues
                );
        }
    }
};

const createTransactionController = async (_transaction) => {
    const transaction = await setAndValidate(_transaction);

    if (defaultState.user == constants.offline) {
        let newTransaction = await createTransactionSQLite(transaction);
        insertTransactionState(newTransaction);
        const newCustomFieldsValues = await createCustomFieldsValuesController(
            newTransaction.id,
            defaultState.customFields
        );
        saveTransactionCustomFieldsLocalState(newCustomFieldsValues);
    } else {
        const customs = defaultState.customFields.filter(
            (custom) => custom.value != undefined && custom.value != ""
        );
        const imageUrisArray = await uploadImagesToFirebase(
            transaction.imageUris
        );
        transaction.imageUris = JSON.stringify(imageUrisArray);
        const result = await insertTransactionRest(transaction, customs);

        if (result.data) {
            defaultState.transactions.push(result.data.transaction);
            defaultState.customFieldsValues =
                defaultState.customFieldsValues.concat(
                    result.data.customFieldValues
                );
        }
    }

    unSetFieldsValuesLocalState();
};

const updateTransactionController = async (_transaction) => {
    const transaction = await setAndValidate(_transaction);

    if (defaultState.user == constants.offline) {
        const result = await updateTransactionSQLite(transaction);
        if (result) {
            updateTransactionState(transaction);
        }

        const newCustomFieldsValues = await updateTransactionCustomFields(
            transaction
        );
        updateTransactionCustomFieldsLocalState(
            transaction.id,
            newCustomFieldsValues
        );
    } else {
        const filesToUpload = [];
        let oldImages = [];

        transaction.imageUris.forEach((url) => {
            if (url.includes("file")) {
                filesToUpload.push(url);
            } else {
                oldImages.push(url);
            }
        });

        const newImages = await uploadImagesToFirebase(filesToUpload);
        oldImages = oldImages.concat(newImages);

        const customs = defaultState.customFields.filter(
            (custom) => custom.value != undefined && custom.value != ""
        );
        transaction.imageUris = JSON.stringify(oldImages);
        const result = await updateTransactionRest(transaction, customs);
        if (result.data.transaction.id != undefined) {
            updateTransactionState(result.data.transaction);

            defaultState.customFieldsValues =
                defaultState.customFieldsValues.filter(
                    (custom) =>
                        custom.transactionId != result.data.transaction.id
                );
            defaultState.customFieldsValues =
                defaultState.customFieldsValues.concat(
                    result.data.customFieldValues
                );
        }
    }
};

const deleteTransactionController = async (transaction, callback) => {
    Alert.alert("Warning", "Are you sure you want to delete transaction?", [
        { text: "No" },

        {
            text: "Yes",
            onPress: async () => {
                let result = false;

                if (defaultState.user == constants.offline) {
                    await deleteCustomFieldValuesByTransactionIdSQLite(
                        transaction.id
                    );
                    result = await deleteTransactionSQLite(transaction.id);
                } else {
                    result = await deleteTransactionRest(transaction.id);
                }
                if (result) {
                    deleteTransactionState(transaction.id);
                    deleteTransactionCustomFieldsValuesLocalState(
                        transaction.id
                    );
                    successMessage("Transaction deleted!");
                    callback();
                }
            },
        },
    ]);
};

const setAndValidate = async (transaction) => {
    if (transaction.type == constants.income) {
        transaction.fromAccountId = undefined;
    }
    if (transaction.type == constants.expense) {
        transaction.toAccountId = undefined;
    }
    await schema.validate(transaction);
    return transaction;
};

const updateTransactionCustomFields = async (transaction) => {
    const result = await deleteCustomFieldValuesByTransactionIdSQLite(
        transaction.id
    );

    if (result) {
        const newCustomFieldsValues = await createCustomFieldsValuesController(
            transaction.id,
            defaultState.customFields
        );
        return newCustomFieldsValues;
    }
};

const schema = yup.object().shape({
    type: yup.string().required().label("Type"),
    amount: yup
        .number()
        .required("required")
        .positive()
        .integer()
        .label("Amount")
        .typeError("Amount is required"),
    date: yup.date().required().label("Date"),
    note: yup.string().label("Note"),
    categoryId: yup.string().required().label("Category"),
});

export {
    createTransactionController,
    updateTransactionController,
    deleteTransactionController,
    createFuturedTransactionController,
};
