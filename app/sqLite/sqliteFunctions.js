import { fetchData, queryDatabase, updateCategorySequence } from "./SQLiteDB";
import { generateId } from "../utils/helpersFunctions";
import { sql } from "./sqLiteSql";
import { defaultState } from "../store/state";
import { constants } from "../constants";

// FetchAllData
const getDataSQLite = () => {
    return new Promise(async (resolve, reject) => {
        const wallets = await fetchData(sql.selectAllWalletsSql);
        const categories = await fetchData(sql.selectAllCategoryesSql);
        const transactions = await fetchData(sql.selectAllTransactionSql);
        const customFields = await fetchData(sql.selectCustomFieldsSql);
        const customFieldsListValues = await fetchData(
            sql.selectCustomFieldListValuesSql
        );
        const customFieldsValues = await fetchData(
            sql.selectCustomFieldValuesSql
        );

        defaultState.wallets = wallets;
        defaultState.categories = categories;
        defaultState.transactions = transactions;
        defaultState.customFields = customFields;
        defaultState.customFieldsListValues = customFieldsListValues;
        defaultState.customFieldsValues = customFieldsValues;

        console.log(defaultState.categories);

        resolve(true);
    });
};

// Categories section
const insertCategorySQLite = ({ name, type, color, icon }) => {
    return new Promise((resolve, reject) => {
        let newId = generateId();
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    const category = {
                        id: newId,
                        name,
                        type,
                        color,
                        icon,
                    };
                    resolve(category);
                }
                reject(data);
            },
            sql.insertCategorySql,
            [newId, name, type, color, icon]
        );
    });
};

const updateCategorySQLite = ({ name, color, icon, id }) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.updateCategorySql,
            [name, color, icon, id]
        );
    });
};

const deleteCategorySQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    updateCategorySequence();
                    resolve(success);
                }
                reject(data);
            },
            sql.deleteCategorySql,
            [id]
        );
    });
};

//Transaction section
const createTransactionSQLite = ({
    amount,
    categoryId,
    date,
    note,
    toAccountId,
    fromAccountId,
    type,
    status,
}) => {
    return new Promise((resolve, reject) => {
        const newId = generateId();
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    var transaction = {
                        id: newId,
                        amount,
                        categoryId,
                        date,
                        note,
                        toAccountId,
                        fromAccountId,
                        type,
                        status,
                    };

                    resolve(transaction);
                }
                reject(data);
            },
            sql.insertTransactionSql,
            [
                newId,
                amount,
                categoryId,
                date.toString(),
                note,
                toAccountId,
                fromAccountId,
                type,
                status,
            ]
        );
    });
};

const updateTransactionSQLite = ({
    amount,
    categoryId,
    date,
    note,
    toAccountId,
    fromAccountId,
    type,
    id,
}) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.updateTransactionSql,
            [
                amount,
                categoryId,
                date.toString(),
                note,
                type == constants.income || type == constants.transfer
                    ? toAccountId
                    : null,
                type == constants.expense || type == constants.transfer
                    ? fromAccountId
                    : null,
                type,
                id,
            ]
        );
    });
};

const deleteTransactionSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteTransactionSql,
            [id]
        );
    });
};

const deleteTransactionsByCateogryIdSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteTransactionByCategorySql,
            [id]
        );
    });
};

const deleteTransactionsByWalletIdSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteTransactionByWalletIdSql,
            [id, id]
        );
    });
};

// CustomFields Section
const insertCustomFieldSQLite = ({ fieldName, fieldType, category }) => {
    return new Promise((resolve, reject) => {
        const newId = generateId();
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    const customField = {
                        id: newId,
                        name: fieldName,
                        type: fieldType,
                        category,
                    };

                    resolve(customField);
                }
                reject(data);
            },
            sql.insertCustomFieldSql,
            [newId, fieldName, category, fieldType]
        );
    });
};

const updateCustomFieldSQLite = (name, id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.updateCustomFieldSql,
            [name, id]
        );
    });
};

const deleteCustomFieldSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteCustomFieldSql,
            [id]
        );
    });
};

// CustomFieldsListValues
const insertCustomFieldListValueSQLite = ({ id, item }) => {
    return new Promise((resolve, reject) => {
        const newId = generateId();
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    var newItem = {
                        id: newId,
                        customFieldId: id,
                        value: item,
                    };
                    resolve(newItem);
                }
                reject(data);
            },
            sql.insertCustomFieldListValuesSql,
            [newId, id, item]
        );
    });
};

const updateCustomFieldListValueSQLite = (value, id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.updateCustomFieldListValueSql,
            [value, id]
        );
    });
};

const deleteCustomFieldListValuesByCustomFieldIdSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteCustomFieldListValuesByCustomFieldIdSql,
            [id]
        );
    });
};

const deleteCustomFieldListValuesByIdSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteCustomFieldListValuesByIdSql,
            [id]
        );
    });
};

//CustomFieldValue
const insertCustomFieldValueSQLite = ({
    customFieldId,
    value,
    transactionId,
}) => {
    return new Promise((resolve, reject) => {
        const newId = generateId();
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    var newCustomFieldValue = {
                        id: newId,
                        customFieldId,
                        value,
                        transactionId,
                    };
                    resolve(newCustomFieldValue);
                }
                reject(data);
            },
            sql.insertCustomFieldValueSql,
            [newId, customFieldId, value.toString(), transactionId]
        );
    });
};

const deleteCustomFieldValuesByTransactionIdSQLite = (transactionId) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteCustomFieldValuesSql,
            [transactionId]
        );
    });
};

const deleteCustomFieldValuesByCustomFieldIdSQLite = (customField) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteCustomFieldValuesByCustomFieldIdSql,
            [customField]
        );
    });
};

const deleteCustomFieldValuesByValueSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteCustomFieldValuesByValueSql,
            [id]
        );
    });
};

//WalletFunctions

const insertWalletSQLite = (name, ballance, color) => {
    return new Promise((resolve, reject) => {
        const newId = generateId();
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    var wallet = {
                        id: newId,
                        name,
                        ballance,
                        color,
                    };
                    resolve(wallet);
                }
                reject(data);
            },
            sql.insertWallet,
            [newId, name, ballance, color]
        );
    });
};

const updateWalletSQLite = ({ name, color, id }) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.updateWalletSql,
            [name, color, id]
        );
    });
};

const deleteWalletSQLite = (id) => {
    return new Promise((resolve, reject) => {
        queryDatabase(
            ({ success, data }) => {
                if (success) {
                    resolve(true);
                }
                reject(data);
            },
            sql.deleteWalletSql,
            [id]
        );
    });
};

export {
    getDataSQLite,
    insertCategorySQLite,
    updateCategorySQLite,
    deleteCategorySQLite,
    createTransactionSQLite,
    updateTransactionSQLite,
    deleteTransactionSQLite,
    deleteTransactionsByCateogryIdSQLite,
    deleteTransactionsByWalletIdSQLite,
    insertCustomFieldSQLite,
    updateCustomFieldSQLite,
    deleteCustomFieldSQLite,
    insertCustomFieldListValueSQLite,
    updateCustomFieldListValueSQLite,
    deleteCustomFieldListValuesByCustomFieldIdSQLite,
    deleteCustomFieldListValuesByIdSQLite,
    insertCustomFieldValueSQLite,
    deleteCustomFieldValuesByTransactionIdSQLite,
    deleteCustomFieldValuesByCustomFieldIdSQLite,
    deleteCustomFieldValuesByValueSQLite,
    insertWalletSQLite,
    updateWalletSQLite,
    deleteWalletSQLite,
};
