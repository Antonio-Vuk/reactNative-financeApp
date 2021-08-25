import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("myDatabase");
import { sql } from "./sqLiteSql";

const updateCategorySequence = () => {
    db.exec(
        [{ sql: sql.updateCategorySequenceSql, args: [] }],
        false,
        () => {}
    );
};

const createTables = () => {
    db.exec(
        [
            { sql: sql.createCategoriesTableSql, args: [] },
            { sql: sql.createWalletTableSql, args: [] },
            { sql: sql.createTransactionTableSql, args: [] },
            { sql: sql.createCustomFieldsTableSql, args: [] },
            { sql: sql.createCustomFieldListValuesTableSql, args: [] },
            { sql: sql.createCustomFieldsValuesTableSql, args: [] },
            { sql: "PRAGMA foreign_keys = ON", args: [] },
        ],
        false,
        () => {
            console.log("Tables are created!");
        }
    );
};

const dropTables = () => {
    db.exec(
        [
            { sql: "DELETE from category", args: [] },
            { sql: "DELETE from wallet", args: [] },
            { sql: "DELETE from custom_field", args: [] },
            {
                sql: "DELETE from custom_field_list_value",
                args: [],
            },
            { sql: "DELETE from custom_field_value", args: [] },
            { sql: "DELETE from 'transaction'", args: [] },
            { sql: "DROP TABLE IF EXISTS category", args: [] },
            { sql: "DROP TABLE IF EXISTS wallet", args: [] },
            { sql: "DROP TABLE IF EXISTS custom_field", args: [] },
            { sql: "DROP TABLE IF EXISTS custom_field_list_value", args: [] },
            { sql: "DROP TABLE IF EXISTS custom_field_value", args: [] },
            { sql: "DROP TABLE IF EXISTS 'transaction'", args: [] },
        ],
        false,
        () => {
            console.log("Tables are delted");
        }
    );
};

const queryDatabase = (myFunction, slqStatement, argsArray = []) => {
    db.transaction((tx) => {
        tx.executeSql(
            slqStatement,
            argsArray,
            (tx, data) => {
                myFunction({ success: true, data: data });
            },
            (tx, error) => {
                myFunction({ success: false, data: error.message });
            }
        ),
            (error) => {
                console.log(error);
            },
            (success) => console.log(success);
    });
};

const fetchData = (sql) => {
    return new Promise((resolve, reject) => {
        queryDatabase(({ success, data }) => {
            if (success) {
                resolve(data.rows._array);
            } else {
                reject(data);
            }
        }, sql);
    });
};

const importDataFromExcelSQLite = (
    transactions,
    categories,
    wallets,
    customFields,
    customFieldsListValues,
    customFieldsValues
) => {
    dropTables();
    createTables();

    categories.forEach((category) => {
        queryDatabase(({ success, data }) => {}, sql.insertCategorySql, [
            category.id,
            category.name,
            category.type,
            category.color,
            category.icon,
        ]);
    });

    wallets.forEach((wallet) => {
        queryDatabase(({ success, data }) => {}, sql.insertWallet, [
            wallet.id,
            wallet.name,
            wallet.ballance,
            wallet.color,
        ]);
    });

    transactions.forEach((trans) => {
        queryDatabase(({ success, data }) => {}, sql.insertTransactionSql, [
            trans.amount,
            trans.categoryId,
            trans.date.toString(),
            trans.note,
            trans.type,
        ]);
    });

    customFields.forEach((customField) => {
        queryDatabase(({ success, data }) => {}, sql.insertCustomFieldSql, [
            customField.id,
            customField.name,
            customField.category,
            customField.type,
        ]);
    });

    customFieldsListValues.forEach((customFieldsListValue) => {
        queryDatabase(
            ({ success, data }) => {},
            sql.insertCustomFieldListValuesSql,
            [
                customFieldsListValue.id,
                customFieldsListValue.customFieldId,
                customFieldsListValue.value,
            ]
        );
    });

    customFieldsValues.forEach((customFieldsValue) => {
        queryDatabase(
            ({ success, data }) => {},
            sql.insertCustomFieldValueSql,
            [
                customFieldsValue.id,
                customFieldsValue.customFieldId,
                customFieldsValue.value,
                customFieldsValue.transactionId,
            ]
        );
    });
};

export {
    updateCategorySequence,
    createTables,
    dropTables,
    queryDatabase,
    fetchData,
    importDataFromExcelSQLite,
};
