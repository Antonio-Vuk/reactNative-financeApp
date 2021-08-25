const { validateCategory } = require("../validation/validation");
const {
    insertCategory,
    updateCategory,
    deleteCategory,
} = require("../model/category");
const express = require("express");
const auth = require("../middleware/auth");
const { selectTransactionsByCategory } = require("../model/transaction");
const {
    deleteCustomFieldValues,
    deleteTransactions,
} = require("../utils/helpers");
const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const { error } = validateCategory(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const category = await insertCategory(req.body, req.user.id);
        if (category) {
            return res.send(category);
        }
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.put("/", auth, async (req, res) => {
    try {
        const { error } = validateCategory(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const categoryRes = await updateCategory(req.body);
        if (categoryRes.changedRows > 0 || categoryRes.affectedRows) {
            return res.send(true);
        } else {
            res.status(400).send("Something wrong!");
        }
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.delete("/:categoryId", auth, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const transactions = await selectTransactionsByCategory(categoryId);
        await deleteCustomFieldValues(transactions);
        await deleteTransactions(transactions);
        await deleteCategory(categoryId);
    } catch (error) {
        return res.status(405).send(error.message);
    }
    res.send(true);
});

module.exports = router;
