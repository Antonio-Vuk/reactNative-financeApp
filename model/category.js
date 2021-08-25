const sqlPool = require("../database");
const { generateId } = require("../utils/helperFunctions");

const insertCategory = async (category, userId) => {
    const id = generateId();
    const sql =
        "INSERT INTO category (id, name, type, color, icon, userId) VALUES ( ?, ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        id,
        category.name,
        category.type,
        category.color,
        category.icon,
        userId,
    ]);
    return {
        id,
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
        userId,
    };
};

const insertCategoryImport = async (category, userId) => {
    const sql =
        "INSERT INTO category (id, name, type, color, icon, userId) VALUES ( ?, ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        category.id,
        category.name,
        category.type,
        category.color,
        category.icon,
        userId,
    ]);
    return result;
};

const updateCategory = async (wallet) => {
    const sql = "UPDATE category SET name = ?, color = ? WHERE id = ?";
    const [result] = await sqlPool.query(sql, [
        wallet.name,
        wallet.color,
        wallet.id,
    ]);
    return result;
};

const selectCategories = async (userId) => {
    const sql = "SELECT * from category where userId = ?";
    const [result] = await sqlPool.query(sql, [userId]);
    return result;
};

const deleteCategory = async (id) => {
    const sql = "DELETE from category where  id = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const deleteUserCategory = async (id) => {
    const sql = "DELETE from category where  userId = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

module.exports = {
    insertCategory,
    updateCategory,
    selectCategories,
    deleteCategory,
    deleteUserCategory,
    insertCategoryImport,
};
