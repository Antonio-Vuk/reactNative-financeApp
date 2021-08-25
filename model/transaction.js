const sqlPool = require("../database");
const { generateId } = require("../utils/helperFunctions");

const insertTransaction = async (transaction, userId) => {
    console.log(transaction);

    const id = generateId();
    const sql =
        "insert into transaction (id, amount, categoryId, date, note, toAccountId, fromAccountId, imageUris, location, type, userId) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        id,
        transaction.amount,
        transaction.categoryId,
        transaction.date,
        transaction.note,
        transaction.toAccountId,
        transaction.fromAccountId,
        JSON.stringify(transaction.imageUris),
        JSON.stringify(transaction.location),
        transaction.type,
        userId,
    ]);
    return {
        id,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        date: transaction.date,
        note: transaction.note,
        toAccountId: transaction.toAccountId,
        fromAccountId: transaction.fromAccountId,
        imageUris: transaction.imageUris,
        location: transaction.location,
        type: transaction.type,
        userId,
    };
};

const insertTransactionImport = async (transaction, userId) => {
    const sql =
        "insert into transaction (id, amount, categoryId, date, note, toAccountId, fromAccountId, type, userId) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        transaction.id,
        transaction.amount,
        transaction.categoryId,
        transaction.date,
        transaction.note,
        transaction.toAccountId,
        transaction.fromAccountId,
        transaction.imageUris,
        transaction.type,
        userId,
    ]);
    return result;
};

const updateTransaction = async (transaction) => {
    const sql =
        "UPDATE transaction SET amount = ?, categoryId = ?, date = ?, note = ?, toAccountId = ?, fromAccountId = ?, imageUris = ?, type = ? WHERE id = ?";
    const [result] = await sqlPool.query(sql, [
        transaction.amount,
        transaction.categoryId,
        transaction.date,
        transaction.note,
        transaction.toAccountId,
        transaction.fromAccountId,
        JSON.stringify(transaction.imageUris),
        transaction.type,
        transaction.id,
    ]);
    return result;
};

const deleteTransaction = async (id) => {
    const sql = "DELETE from transaction where id = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const deleteUserTransactions = async (id) => {
    const sql = "DELETE from transaction where userId = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const selectTransactions = async (userId) => {
    const sql = "SELECT * from transaction where userId = ?";
    const [result] = await sqlPool.query(sql, [userId]);
    return result;
};

const selectTransactionsByWallet = async (walletId) => {
    const sql =
        "SELECT * from transaction where toAccountId = ? or fromAccountId = ?";
    const [result] = await sqlPool.query(sql, [walletId, walletId]);
    return result;
};

const selectTransactionsByCategory = async (categoryId) => {
    const sql = "SELECT * from transaction where categoryId = ?";
    const [result] = await sqlPool.query(sql, [categoryId]);
    return result;
};

module.exports = {
    insertTransaction,
    selectTransactions,
    selectTransactionsByWallet,
    selectTransactionsByCategory,
    deleteTransaction,
    updateTransaction,
    deleteUserTransactions,
    insertTransactionImport,
};
