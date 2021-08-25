import { defaultState } from "../store/state";

const insertWalletLocalState = (wallet) => {
    defaultState.wallets.push(wallet);
};

const updateWalletLocalState = (wallet) => {
    var index = defaultState.wallets.findIndex((item) => item.id == wallet.id);
    defaultState.wallets[index] = wallet;
};

const deleteWalletLocalState = (walletId) => {
    defaultState.transactions = defaultState.transactions.filter(
        (item) => item.toAccountId != walletId && item.fromAccountId != walletId
    );

    defaultState.wallets = defaultState.wallets.filter(
        (item) => item.id != walletId
    );
};

const deleteWalletStateRest = (id) => {
    defaultState.wallets = defaultState.wallets.filter(
        (wallet) => wallet.id != id
    );

    const transactions = defaultState.transactions.filter(
        (transaction) =>
            transaction.toAccountId == id || transaction.fromAccountId == id
    );

    defaultState.transactions = defaultState.transactions.filter(
        (transaction) =>
            transaction.toAccountId != id && transaction.fromAccountId != id
    );

    transactions.forEach((transaction) => {
        defaultState.customFieldsValues =
            defaultState.customFieldsValues.filter(
                (custom) => custom.transactionId != transaction.id
            );
    });
};

export {
    insertWalletLocalState,
    updateWalletLocalState,
    deleteWalletLocalState,
    deleteWalletStateRest,
};
