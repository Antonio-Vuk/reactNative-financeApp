const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { validate } = require("../validation/validation");
const { getUser, generateAuthToken } = require("../model/user");

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    var existingUser = await getUser(req.body.email);
    if (!existingUser) {
        return res.status(400).send("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
    );

    if (!validPassword) {
        return res.status(400).send("Invalid email or password!");
    }

    const token = generateAuthToken(existingUser);
    return res.send(token);
});

module.exports = router;
