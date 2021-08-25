const express = require("express");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const router = express.Router();

const { validate } = require("../validation/validation");
const {
    getUser,
    saveUser,
    generateAuthToken,
    getUsers,
} = require("../model/user");

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    var existingUser = await getUser(req.body.email);
    if (existingUser) {
        return res.status(400).send("User already exists.");
    }

    const newUser = req.body;
    const salt = await bcrypt.genSalt(5);
    newUser.password = await bcrypt.hash(req.body.password, salt);

    const user = await saveUser(newUser);

    const token = generateAuthToken(user);

    return res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(user);
});

router.get("/", auth, async (req, res) => {
    try {
        const result = await getUsers();
        return res.send(result);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

module.exports = router;
