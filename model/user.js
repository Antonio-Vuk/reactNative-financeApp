const sqlPool = require("../database");
const jwt = require("jsonwebtoken");

const getUser = async (email) => {
    const sql = "select * from Users where email = ?";
    const [result] = await sqlPool.query(sql, [email]);
    return result[0];
};

const saveUser = async (user) => {
    const sql = "insert into Users ( email, password) values (?, ?)";
    const [result] = await sqlPool.query(sql, [user.email, user.password]);

    return {
        id: result.insertId,
        email: user.email,
    };
};

const getUsers = async () => {
    const sql = "select id, email from users";
    const [result] = await sqlPool.query(sql);
    return result;
};

const generateAuthToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, "jwtPrivateKey");
};

module.exports = { getUser, saveUser, generateAuthToken, getUsers };
