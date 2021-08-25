const sqlPool = require("../database");
const { generateId } = require("../utils/helperFunctions");

const insertCustomFieldListValue = async (customFieldId, value) => {
    const id = generateId();
    const sql =
        "INSERT INTO custom_field_list_value (id, customFieldId, value) VALUES ( ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [id, customFieldId, value]);
    return {
        id,
        customFieldId,
        value,
    };
};

const insertCustomFieldListValueImport = async (customFieldListValue) => {
    const sql =
        "INSERT INTO custom_field_list_value (id, customFieldId, value) VALUES ( ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        customFieldListValue.id,
        customFieldListValue.customFieldId,
        customFieldListValue.value,
    ]);
    return result;
};
const updateCustomFieldListValue = async (id, value) => {
    const sql = "UPDATE custom_field_list_value SET value = ? WHERE id = ?";
    const [result] = await sqlPool.query(sql, [value, id]);
    return result;
};

const selectCustomFieldListValues = async (customFieldId) => {
    const sql = "SELECT * from custom_field_list_value where customFieldId = ?";
    const [result] = await sqlPool.query(sql, [customFieldId]);
    return result;
};

const deleteCustomFieldListValueByCustom = async (id) => {
    const sql = "DELETE from custom_field_list_value where customFieldId = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const deleteCustomFieldListValue = async (id) => {
    const sql = "DELETE from custom_field_list_value where id = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

module.exports = {
    insertCustomFieldListValue,
    selectCustomFieldListValues,
    deleteCustomFieldListValueByCustom,
    updateCustomFieldListValue,
    deleteCustomFieldListValue,
    insertCustomFieldListValueImport,
};
