import { defaultState } from "./state";

const insertCategoryLocalState = (category) => {
    defaultState.categories.push(category);
};

const updateCategoryLocalState = (category) => {
    var index = defaultState.categories.findIndex(
        (item) => item.id == category.id
    );
    defaultState.categories[index] = category;
};

const deleteCategoryState = (categoryId) => {
    defaultState.transactions = defaultState.transactions.filter(
        (item) => item.categoryId != categoryId
    );
    defaultState.categories = defaultState.categories.filter(
        (category) => category.id != categoryId
    );
};

const deleteCategoryStateRest = (id) => {
    defaultState.categories = defaultState.categories.filter(
        (category) => category.id != id
    );

    const transactions = defaultState.transactions.filter(
        (transaction) => transaction.categoryId == id
    );

    defaultState.transactions = defaultState.transactions.filter(
        (transaction) => transaction.categoryId != id
    );

    transactions.forEach((transaction) => {
        defaultState.customFieldsValues =
            defaultState.customFieldsValues.filter(
                (custom) => custom.transactionId != transaction.id
            );
    });
};

export {
    insertCategoryLocalState,
    updateCategoryLocalState,
    deleteCategoryState,
    deleteCategoryStateRest,
};
