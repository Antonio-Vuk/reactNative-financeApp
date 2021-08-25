const Joi = require("joi");

const validate = (req) => {
    const schema = Joi.object({
        email: Joi.string().required().email().label("Email"),
        password: Joi.string().required().min(4).max(12).label("Password"),
    });
    return schema.validate(req);
};

const validateWallet = (wallet) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Name"),
        ballance: Joi.number().required().label("Ballance"),
        color: Joi.string().required().label("Color"),
        id: Joi.string().label("Id"),
    });
    return schema.validate(wallet);
};

const validateCategory = (category) => {
    const schema = Joi.object({
        id: Joi.string().label("Id"),
        name: Joi.string().required().label("Name"),
        type: Joi.number().label("Type"),
        color: Joi.string().required().label("Color"),
        icon: Joi.number().label("Icon"),
    });
    return schema.validate(category);
};

const validatecustomFields = (custom) => {
    const schema = Joi.object({
        fieldName: Joi.string().required().label("Name"),
        fieldType: Joi.required().label("Type"),
        category: Joi.required().label("Category"),
        listItems: Joi.array().label("Custom fild list values"),
    });
    return schema.validate(custom);
};

const validateTransaction = (transaction) => {
    const schema = Joi.object({
        id: Joi.string().label("Id"),
        type: Joi.number().required().label("Type"),
        amount: Joi.number()
            .required("required")
            .positive()
            .integer()
            .label("Amount"),
        date: Joi.date().required().label("Date"),
        note: Joi.string().empty("").label("Note"),
        categoryId: Joi.string().required().label("Category"),
        toAccountId: Joi.string().label("Recepient account"),
        fromAccountId: Joi.string().label("Sender account"),
        imageUris: Joi.array().label("Image array"),
        location: Joi.object().label("Location"),
    });
    return schema.validate(transaction);
};

module.exports = {
    validate,
    validateWallet,
    validateCategory,
    validatecustomFields,
    validateTransaction,
};
