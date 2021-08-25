const { deleteCustomFieldValue } = require("../model/customFieldValue");
const { deleteTransaction } = require("../model/transaction");

const deleteCustomFieldValues = async (transactions) => {
    const promises = transactions.map(async (transaction) => {
        return await deleteCustomFieldValue(transaction.id);
    });
    await Promise.all(promises);
};
const deleteTransactions = async (transactions) => {
    const promises = transactions.map(async (transaction) => {
        return await deleteTransaction(transaction.id);
    });
    await Promise.all(promises);
};

module.exports = { deleteCustomFieldValues, deleteTransactions };
