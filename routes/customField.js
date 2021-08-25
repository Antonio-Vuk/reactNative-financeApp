const { validatecustomFields } = require("../validation/validation");
const express = require("express");
const auth = require("../middleware/auth");
const {
    insertCustomField,
    updateCustomField,
    deleteCustomField,
} = require("../model/customField");
const router = express.Router();
const constants = require("../constants");
const {
    insertCustomFieldListValue,
    deleteCustomFieldListValueByCustom,
} = require("../model/customFieldListValues");

const {
    deleteCustomFieldValueByCustomFieldId,
} = require("../model/customFieldValue");

router.post("/", auth, async (req, res) => {
    try {
        const { error } = validatecustomFields(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const custom = {
            name: req.body.fieldName,
            type: req.body.fieldType,
            category: req.body.category,
        };
        const customField = await insertCustomField(custom, req.user.id);
        let customFieldListValues = [];
        if (custom.type == constants.list) {
            customFieldListValues = await insertListValues(
                customField.id,
                req.body.listItems
            );
        }
        return res.send({ customField, customFieldListValues });
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.put("/", auth, async (req, res) => {
    try {
        const name = req.body.name;
        const id = req.body.id;
        await updateCustomField(name, id);
        res.send(true);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        await deleteCustomFieldValueByCustomFieldId(id);
        await deleteCustomFieldListValueByCustom(id);
        await deleteCustomField(id);
        res.send(true);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

const insertListValues = async (customFieldId, listItems) => {
    const promises = listItems.map(async (listItem) => {
        let customFieldListValue = await insertCustomFieldListValue(
            customFieldId,
            listItem
        );
        return customFieldListValue;
    });
    return await Promise.all(promises);
};

module.exports = router;
