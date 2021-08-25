import { Alert } from "react-native";
import { constants } from "../constants";
import {
    deleteCategorySQLite,
    deleteTransactionsByCateogryIdSQLite,
    insertCategorySQLite,
    updateWalletSQLite,
    deleteCustomFieldValuesByTransactionIdSQLite,
} from "../sqLite/sqliteFunctions";
import {
    deleteCategoryState,
    deleteCategoryStateRest,
    insertCategoryLocalState,
    updateCategoryLocalState,
} from "../store/categoryState";
import { deleteTransactionCustomFieldsValuesLocalState } from "../store/customFieldsState";
import { defaultState } from "../store/state";
import { successMessage } from "../utils/helpersFunctions";
import {
    deleteCategoryRest,
    insertCategoryRest,
    updateCategoryRest,
} from "../rest/category";

const insertCategoryController = async (category) => {
    let newCategory = undefined;
    if (defaultState.user == constants.offline) {
        newCategory = await insertCategorySQLite(category);
    } else {
        const result = await insertCategoryRest(category);
        newCategory = result.data;
    }
    if (newCategory.id) {
        insertCategoryLocalState(newCategory);
        successMessage("Category created!");
    }
};

const updateCategoryController = async (category) => {
    let success = false;
    if (defaultState.user == constants.offline) {
        success = await updateWalletSQLite(category);
    } else {
        success = await updateCategoryRest(category);
    }
    if (success) {
        updateCategoryLocalState(category);
        successMessage("Category edited!");
    }
};

const deleteCategoryController = (item, callback) => {
    Alert.alert(
        "Delete",
        "Are you sure you want to delete category: " + item.name + "!",
        [
            { text: "No" },
            {
                text: "Yes",
                onPress: async () => {
                    if (defaultState.user == constants.offline) {
                        await deleteCategoryCustomFieldsValues(item.id);
                        await deleteTransactionsByCateogryIdSQLite(item.id);
                        await deleteCategorySQLite(item.id);
                        deleteCategoryState(item.id);
                    } else {
                        const result = await deleteCategoryRest(item.id);
                        if (result.data) {
                            deleteCategoryStateRest(item.id);
                        }
                    }
                    successMessage("Category deleted!");
                    callback();
                },
            },
        ]
    );
};

const deleteCategoryCustomFieldsValues = async (categoryId) => {
    const transactions = defaultState.transactions.filter(
        (transaction) => transaction.categoryId == categoryId
    );

    transactions.forEach(async (transaction) => {
        await deleteCustomFieldValuesByTransactionIdSQLite(transaction.id);
        deleteTransactionCustomFieldsValuesLocalState(transaction.id);
    });
};

export {
    insertCategoryController,
    updateCategoryController,
    deleteCategoryController,
};
