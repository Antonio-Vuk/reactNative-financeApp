const express = require("express");
const auth = require("../middleware/auth");
const {
    insertCustomFieldListValue,
    updateCustomFieldListValue,
    deleteCustomFieldListValue,
} = require("../model/customFieldListValues");
const { deleteCustomFieldValueByValue } = require("../model/customFieldValue");
const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const id = req.body.id;
        const item = req.body.item;
        const customFieldListValue = await insertCustomFieldListValue(id, item);
        res.send({ ...customFieldListValue });
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.put("/", auth, async (req, res) => {
    try {
        const id = req.body.id;
        const value = req.body.value;
        await updateCustomFieldListValue(id, value);
        res.send(true);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        await deleteCustomFieldValueByValue(id);
        await deleteCustomFieldListValue(id);
        res.send(true);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

module.exports = router;
