const sqlPool = require("../database");
const { generateId } = require("../utils/helperFunctions");

const insertCustomFieldValue = async (customFieldId, value, transactionId) => {
    const id = generateId();
    const sql =
        "INSERT INTO custom_field_value (id, customFieldId, value, transactionId) VALUES (?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        id,
        customFieldId,
        value,
        transactionId,
    ]);
    return {
        id,
        customFieldId,
        value,
        transactionId,
    };
};

const insertCustomFieldValueImport = async (customFieldValue) => {
    const sql =
        "INSERT INTO custom_field_value (id, customFieldId, value, transactionId) VALUES (?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        customFieldValue.id,
        customFieldValue.customFieldId,
        customFieldValue.value,
        customFieldValue.transactionId,
    ]);
    return result;
};

const selectCustomFieldValues = async (transactionId) => {
    const sql = "SELECT * from custom_field_value where transactionId = ?";
    const [result] = await sqlPool.query(sql, [transactionId]);
    return result;
};

const deleteCustomFieldValue = async (id) => {
    const sql = "DELETE from custom_field_value where transactionId = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const deleteCustomFieldValueByCustomFieldId = async (id) => {
    const sql = "DELETE from custom_field_value where customFieldId = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const deleteCustomFieldValueByValue = async (value) => {
    const sql = "DELETE from custom_field_value where value = ?";
    const [result] = await sqlPool.query(sql, [value]);
    return result;
};

module.exports = {
    insertCustomFieldValue,
    selectCustomFieldValues,
    deleteCustomFieldValue,
    deleteCustomFieldValueByCustomFieldId,
    deleteCustomFieldValueByValue,
    insertCustomFieldValueImport,
};
