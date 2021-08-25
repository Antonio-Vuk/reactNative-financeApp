const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
    selectWallets,
    deleteUserWallet,
    insertWalletImport,
} = require("../model/wallet");
const {
    selectCategories,
    deleteUserCategory,
    insertCategoryImport,
} = require("../model/category");
const {
    selectTransactions,
    deleteUserTransactions,
    insertTransactionImport,
} = require("../model/transaction");
const {
    selectCustomFields,
    deleteUserCustomFields,
    insertCustomFieldImport,
} = require("../model/customField");
const {
    selectCustomFieldListValues,
    deleteCustomFieldListValueByCustom,
    insertCustomFieldListValueImport,
} = require("../model/customFieldListValues");
const {
    selectCustomFieldValues,
    deleteCustomFieldValueByCustomFieldId,
    insertCustomFieldValueImport,
} = require("../model/customFieldValue");

const constants = require("../constants");

router.get("/", auth, async (req, res) => {
    try {
        const wallets = await selectWallets(req.user.id);
        const categories = await selectCategories(req.user.id);
        const transactions = await selectTransactions(req.user.id);
        const customFields = await selectCustomFields(req.user.id);
        const customFieldsListValues = await getCustomFieldsListValues(
            customFields
        );
        const customFieldsValues = await getCustomFieldsValues(transactions);

        res.send({
            wallets,
            categories,
            transactions,
            customFields,
            customFieldsListValues,
            customFieldsValues,
        });
    } catch (error) {
        return res.status(405).send(error.message);
    }
});
router.delete("/", auth, async (req, res) => {
    try {
        const id = req.user.id;
        const customFields = await selectCustomFields(id);
        await deleteCustomFieldValues(customFields);
        await deleteCustomFieldListValues(customFields);
        await deleteUserCustomFields(id);
        await deleteUserTransactions(id);
        await deleteUserCategory(id);
        await deleteUserWallet(id);

        res.send(true);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const {
            transactions,
            categories,
            wallets,
            customFields,
            customFieldsListValues,
            customFieldsValues,
        } = req.body;
        const userId = req.user.id;
        await insertArray(categories, userId, insertCategoryImport);
        await insertArray(wallets, userId, insertWalletImport);
        await insertArray(customFields, userId, insertCustomFieldImport);
        await insertArray(
            customFieldsListValues,
            userId,
            insertCustomFieldListValueImport
        );
        await insertArray(transactions, userId, insertTransactionImport);
        await insertArray(
            customFieldsValues,
            userId,
            insertCustomFieldValueImport
        );
        return res.send(true);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

const insertArray = async (array, userId, method) => {
    const promises = array.map(async (item) => {
        return await method(item, userId);
    });
    await Promise.all(promises);
};

const deleteCustomFieldListValues = async (customFields) => {
    const promises = customFields.map(async (custom) => {
        return await deleteCustomFieldListValueByCustom(custom.id);
    });
    await Promise.all(promises);
};

const deleteCustomFieldValues = async (customFields) => {
    const promises = customFields.map(async (custom) => {
        return await deleteCustomFieldValueByCustomFieldId(custom.id);
    });
    await Promise.all(promises);
};

const getCustomFieldsValues = async (transactions) => {
    const promises = transactions.map(async (transaction) => {
        return await selectCustomFieldValues(transaction.id);
    });

    const resultArray = await Promise.all(promises);

    let fields = [];

    resultArray.forEach((array) => {
        if (array != null) {
            array.forEach((item) => {
                fields.push(item);
            });
        }
    });
    return fields;
};

const getCustomFieldsListValues = async (customFields) => {
    const promises = customFields.map(async (custom) => {
        if (custom.type == constants.list) {
            return await selectCustomFieldListValues(custom.id);
        }
    });

    const resultArray = await Promise.all(promises);

    let fields = [];

    resultArray.forEach((array) => {
        if (array != null) {
            array.forEach((item) => {
                fields.push(item);
            });
        }
    });
    return fields;
};

module.exports = router;
