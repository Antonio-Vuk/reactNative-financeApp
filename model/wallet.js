const sqlPool = require("../database");
const { generateId } = require("../utils/helperFunctions");

const insertWallet = async (wallet, userId) => {
    const id = generateId();
    const sql =
        "INSERT INTO wallet (id, name, ballance, color, userId) VALUES ( ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        id,
        wallet.name,
        wallet.ballance,
        wallet.color,
        userId,
    ]);
    return {
        id,
        name: wallet.name,
        ballance: wallet.ballance,
        color: wallet.color,
        userId,
    };
};

const insertWalletImport = async (wallet, userId) => {
    const sql =
        "INSERT INTO wallet (id, name, ballance, color, userId) VALUES ( ?, ?, ?, ?, ?)";
    const [result] = await sqlPool.query(sql, [
        wallet.id,
        wallet.name,
        wallet.ballance,
        wallet.color,
        userId,
    ]);
    return result;
};

const updateWallet = async (wallet) => {
    const sql = "UPDATE wallet SET name = ?, color = ? WHERE id = ?";
    const [result] = await sqlPool.query(sql, [
        wallet.name,
        wallet.color,
        wallet.id,
    ]);
    return result;
};

const selectWallets = async (userId) => {
    const sql = "SELECT * from wallet where userId = ?";
    const [result] = await sqlPool.query(sql, [userId]);
    return result;
};

const deleteWallet = async (id) => {
    const sql = "DELETE from wallet where id = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

const deleteUserWallet = async (id) => {
    const sql = "DELETE from wallet where userId = ?";
    const [result] = await sqlPool.query(sql, [id]);
    return result;
};

module.exports = {
    insertWallet,
    updateWallet,
    selectWallets,
    deleteWallet,
    deleteUserWallet,
    insertWalletImport,
};
