import { Alert } from "react-native";
import * as yup from "yup";
import { constants } from "../constants";
import {
    insertCustomFieldSQLite,
    updateCustomFieldSQLite,
    deleteCustomFieldSQLite,
    insertCustomFieldListValueSQLite,
    deleteCustomFieldListValuesByIdSQLite,
    updateCustomFieldListValueSQLite,
    deleteCustomFieldListValuesByCustomFieldIdSQLite,
    insertCustomFieldValueSQLite,
    deleteCustomFieldValuesByCustomFieldIdSQLite,
    deleteCustomFieldValuesByValueSQLite,
} from "../sqLite/sqliteFunctions";
import {
    createCustomFieldsLocalState,
    deleteCustomFieldLocalState,
    editCustomFieldNameLocalState,
    createCustomFieldListValueLocalState,
    editCustomFieldListValueLocalState,
    deleteCustomFieldListValueLocalState,
} from "../store/customFieldsState";
import { defaultState } from "../store/state";
import { successMessage } from "../utils/helpersFunctions";
import {
    deleteCustomFieldRest,
    insertCustomFieldRest,
    updateCustomFieldRest,
} from "../rest/customField";
import {
    deleteCustomFieldListValueRest,
    insertCustomFieldListValueRest,
    updateCustomFieldListValueRest,
} from "../rest/customFieldListValue";

const customSchema = yup.object().shape({
    fieldName: yup
        .string()
        .required()
        .label("Name")
        .typeError("Name is required"),
    fieldType: yup
        .string()
        .required()
        .label("Type")
        .typeError("Type is required"),
    category: yup.string().required().label("Category"),
});

//CustomFieldSection
const createCustomFieldController = async (
    { fieldName, fieldType, listItems, category },
    callback
) => {
    const data = await customSchema.validate({
        fieldName,
        fieldType,
        category,
    });

    if (fieldType == constants.list && listItems.length < 2) {
        Alert.alert("Warning", "Enter at least two items");
        return;
    }

    if (defaultState.user == constants.offline) {
        const customField = await insertCustomFieldSQLite(data);

        var newFieldValues = [];
        if (customField && fieldType == constants.list) {
            newFieldValues = await createCustomFieldListValues(
                customField.id,
                listItems
            );
        }
        createCustomFieldsLocalState(customField, newFieldValues);
    } else {
        const result = await insertCustomFieldRest(
            fieldName,
            fieldType,
            listItems,
            category
        );
        defaultState.customFields.push(result.data.customField);
        defaultState.customFieldsListValues =
            defaultState.customFieldsListValues.concat(
                result.data.customFieldListValues
            );
    }

    successMessage("Custom field created!");
    callback();
};

const createCustomFieldListValues = async (customFieldId, listItems) => {
    const newFieldValues = [];
    for (let index = 0; index < listItems.length; index++) {
        const element = listItems[index];
        var newCustomFieldListValue = await insertCustomFieldListValueSQLite({
            id: customFieldId,
            item: element,
        });
        newFieldValues.push(newCustomFieldListValue);
    }
    return newFieldValues;
};

const editCustomFieldNameController = async (item, value) => {
    let result = false;

    if (defaultState.user == constants.offline) {
        result = await updateCustomFieldSQLite(value, item.id);
    } else {
        result = await updateCustomFieldRest(value, item.id);
    }
    if (result) {
        editCustomFieldNameLocalState(item, value);
    }
};

const deleteCustomFieldController = async (field) => {
    if (defaultState.user == constants.offline) {
        await deleteCustomFieldValuesByCustomFieldIdSQLite(field.id);
        await deleteCustomFieldListValuesByCustomFieldIdSQLite(field.id);
        await deleteCustomFieldSQLite(field.id);
    } else {
        await deleteCustomFieldRest(field.id);
    }
    deleteCustomFieldLocalState(field);
};

//Custom Field List Values Section

const createCustomFieldListValueController = async (
    customFieldId,
    listItem
) => {
    var newCustomFieldListValue = undefined;

    if (defaultState.user == constants.offline) {
        newCustomFieldListValue = await insertCustomFieldListValueSQLite({
            id: customFieldId,
            item: listItem,
        });
    } else {
        const result = await insertCustomFieldListValueRest(
            customFieldId,
            listItem
        );
        newCustomFieldListValue = result.data;
    }
    createCustomFieldListValueLocalState(newCustomFieldListValue);
};

const editCustomFieldListValueController = async (value, id) => {
    let result = false;
    if (defaultState.user == constants.offline) {
        result = await updateCustomFieldListValueSQLite(value, id);
    } else {
        result = await updateCustomFieldListValueRest(value, id);
    }
    if (result) {
        editCustomFieldListValueLocalState(value, id);
    }
};

const deleteCustomFieldListValueController = async (id) => {
    let result = false;
    if (defaultState.user == constants.offline) {
        await deleteCustomFieldValuesByValueSQLite(id);
        result = await deleteCustomFieldListValuesByIdSQLite(id);
    } else {
        result = await deleteCustomFieldListValueRest(id);
    }
    if (result) {
        deleteCustomFieldListValueLocalState(id);
    }
};

// Custom Fields Values Section
const createCustomFieldsValuesController = async (
    transactionId,
    customFields
) => {
    const newFields = [];
    for (let index = 0; index < customFields.length; index++) {
        const element = customFields[index];

        if (element.value != undefined && element.value != "") {
            var item = {
                customFieldId: element.id,
                value: element.value,
                transactionId,
            };
            const newCustomFieldValue = await insertCustomFieldValueSQLite(
                item
            );
            newFields.push(newCustomFieldValue);
        }
    }
    return newFields;
};

export {
    createCustomFieldController,
    editCustomFieldNameController,
    deleteCustomFieldController,
    createCustomFieldListValueController,
    deleteCustomFieldListValueController,
    editCustomFieldListValueController,
    createCustomFieldsValuesController,
};
