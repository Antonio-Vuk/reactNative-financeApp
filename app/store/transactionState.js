import { defaultState } from "./state";

const insertTransactionState = (transaction) => {
    defaultState.transactions.unshift(transaction);
};

const updateTransactionState = (transaction) => {
    var index = defaultState.transactions.findIndex(
        (item) => item.id == transaction.id
    );
    defaultState.transactions[index] = transaction;
};

const deleteTransactionState = (transactionId) => {
    defaultState.transactions = defaultState.transactions.filter(
        (item) => item.id != transactionId
    );
};

export {
    insertTransactionState,
    updateTransactionState,
    deleteTransactionState,
};
