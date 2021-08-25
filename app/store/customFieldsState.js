import { defaultState } from "./state";

const createCustomFieldsLocalState = (customField, newFieldValues) => {
    defaultState.customFields.push(customField);
    defaultState.customFieldsListValues =
        defaultState.customFieldsListValues.concat(newFieldValues);
};

const editCustomFieldNameLocalState = (item, newName) => {
    var index = defaultState.customFields.findIndex((el) => el.id == item.id);
    defaultState.customFields[index].name = newName;
};

const deleteCustomFieldLocalState = (field) => {
    defaultState.customFields = defaultState.customFields.filter(
        (el) => el.id != field.id
    );
    defaultState.customFieldsListValues =
        defaultState.customFieldsListValues.filter(
            (el) => el.customFieldId != field.id
        );
    defaultState.customFieldsValues = defaultState.customFieldsValues.filter(
        (el) => el.customFieldId != field.id
    );
};

const createCustomFieldListValueLocalState = (newCustomFieldListValue) => {
    defaultState.customFieldsListValues.push(newCustomFieldListValue);
};

const editCustomFieldListValueLocalState = (value, id) => {
    var index = defaultState.customFieldsListValues.findIndex(
        (el) => el.id == id
    );
    defaultState.customFieldsListValues[index].value = value;
};

const deleteCustomFieldListValueLocalState = (id) => {
    defaultState.customFieldsListValues =
        defaultState.customFieldsListValues.filter((el) => el.id != id);

    defaultState.customFieldsValues = defaultState.customFieldsValues.filter(
        (el) => el.value != id
    );
};

const saveTransactionCustomFieldsLocalState = (newCustomFieldsValues) => {
    defaultState.customFieldsValues = defaultState.customFieldsValues.concat(
        newCustomFieldsValues
    );
};

const updateTransactionCustomFieldsLocalState = (
    transactionId,
    updatedCustomFieldsValues
) => {
    defaultState.customFieldsValues = defaultState.customFieldsValues.filter(
        (field) => field.transactionId != transactionId
    );
    defaultState.customFieldsValues = defaultState.customFieldsValues.concat(
        updatedCustomFieldsValues
    );
};

const deleteTransactionCustomFieldsValuesLocalState = (transactionId) => {
    defaultState.customFieldsValues = defaultState.customFieldsValues.filter(
        (custom) => custom.transactionId != transactionId
    );
};

const unSetFieldsValuesLocalState = () => {
    defaultState.customFields.forEach((element) => {
        element.value = undefined;
    });
};

const setFieldsValuesLocalState = (transactionId) => {
    var customsEl = defaultState.customFieldsValues.filter(
        (el) => el.transactionId == transactionId
    );

    defaultState.customFields.forEach((item) => {
        item.value = undefined;
    });

    customsEl.forEach((element) => {
        var index = defaultState.customFields.findIndex(
            (item) => item.id == element.customFieldId
        );
        defaultState.customFields[index].value = element.value;
    });
};

export {
    createCustomFieldsLocalState,
    editCustomFieldNameLocalState,
    deleteCustomFieldLocalState,
    createCustomFieldListValueLocalState,
    editCustomFieldListValueLocalState,
    deleteCustomFieldListValueLocalState,
    setFieldsValuesLocalState,
    unSetFieldsValuesLocalState,
    saveTransactionCustomFieldsLocalState,
    updateTransactionCustomFieldsLocalState,
    deleteTransactionCustomFieldsValuesLocalState,
};
