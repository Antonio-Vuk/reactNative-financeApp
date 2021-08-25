const { validateWallet } = require("../validation/validation");
const { insertWallet, updateWallet } = require("../model/wallet");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { selectTransactionsByWallet } = require("../model/transaction");
const { deleteWallet } = require("../model/wallet");
const {
    deleteTransactions,
    deleteCustomFieldValues,
} = require("../utils/helpers");
router.post("/", auth, async (req, res) => {
    try {
        const { error } = validateWallet(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const wallet = await insertWallet(req.body, req.user.id);
        if (wallet) {
            return res.send(wallet);
        }
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.put("/", auth, async (req, res) => {
    try {
        const { error } = validateWallet(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const walletRes = await updateWallet(req.body);
        if (walletRes.changedRows > 0 || walletRes.affectedRows) {
            return res.send(true);
        } else {
            res.status(400).send("Something wrong!");
        }
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.delete("/:walletId", auth, async (req, res) => {
    try {
        const walletId = req.params.walletId;
        const transactions = await selectTransactionsByWallet(walletId);
        await deleteCustomFieldValues(transactions);
        await deleteTransactions(transactions);
        await deleteWallet(walletId);
    } catch (error) {
        return res.status(405).send(error.message);
    }
    res.send(true);
});

module.exports = router;
