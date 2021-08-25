const sqlPool = require("../database");
const { generateId } = require("../utils/helperFunctions");

const insertCustomField = async (customField, userId) => {
    const id = generateId();
    const sql =
        "INSERT INTO custom_field (id, name, category, type, userId) VALUES ( ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        id,
        customField.name,
        customField.category,
        customField.type,
        userId,
    ]);
    return {
        id,
        name: customField.name,
        category: customField.category,
        type: customField.type,
    };
};
const insertCustomFieldImport = async (customField, userId) => {
    const sql =
        "INSERT INTO custom_field (id, name, category, type, userId) VALUES ( ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        customField.id,
        customField.name,
        customField.category,
        customField.type,
        userId,
    ]);
    return result;
};
const selectCustomFields = async (userId) => {
    const sql = "SELECT * from custom_field where userId = ?";
    const [result] = await sqlPool.query(sql, [userId]);
    return result;
};

const updateCustomField = async (name, id) => {
    const sql = "UPDATE custom_field SET name = ? WHERE id = ?";
    const [result] = await sqlPool.query(sql, [name, id]);
    return result;
};

const deleteCustomField = async (id) => {
    const sql = "DELETE from custom_field where id = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const deleteUserCustomFields = async (id) => {
    const sql = "DELETE from custom_field where userId = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

module.exports = {
    insertCustomField,
    selectCustomFields,
    updateCustomField,
    deleteCustomField,
    deleteUserCustomFields,
    insertCustomFieldImport,
};
