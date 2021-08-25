// Category
const updateCategorySequenceSql =
    "UPDATE SQLITE_SEQUENCE SET SEQ=(SELECT MAX(id) FROM category) WHERE NAME='category'";
const createCategoriesTableSql =
    "CREATE TABLE IF NOT EXISTS category(" +
    "id TEXT NOT NULL PRIMARY KEY, " +
    "name TEXT NOT NULL UNIQUE, " +
    "type INTEGER NOT NULL, " +
    "color TEXT NOT NULL, " +
    "icon INTEGER NOT NULL)";
const insertCategorySql =
    "insert into category (id, name, type, color, icon) VALUES ( ?, ?, ?, ?, ?)";
const selectAllCategoryesSql = "SELECT * from category";
const updateCategorySql =
    "UPDATE category SET name = ?, color = ?, icon = ? WHERE id = ?";
const deleteCategorySql = "DELETE from category where id = ?";

const categorySql = {
    updateCategorySequenceSql,
    createCategoriesTableSql,
    insertCategorySql,
    updateCategorySql,
    deleteCategorySql,
    selectAllCategoryesSql,
};

// Transaction
const createTransactionTableSql =
    "CREATE TABLE IF NOT EXISTS 'transaction' (" +
    "id TEXT NOT NULL PRIMARY KEY, " +
    "amount INTEGER NOT NULL, " +
    "categoryId TEXT, " +
    "date TEXT NOT NULL, " +
    "note TEXT, " +
    "toAccountId TEXT, " +
    "fromAccountId TEXT, " +
    "type INTEGER NOT NULL, " +
    "FOREIGN KEY(toAccountId) REFERENCES wallet(id), " +
    "FOREIGN KEY(fromAccountId) REFERENCES wallet(id), " +
    "FOREIGN KEY(categoryId) REFERENCES category(id))";

const insertTransactionSql =
    "INSERT INTO 'transaction' " +
    " (id, amount, categoryId, date, note, toAccountId, fromAccountId, type) " +
    "VALUES( ?, ?, ?, ?, ?, ?, ?, ?)";

const selectAllTransactionSql = "SELECT * from 'transaction' ORDER BY id DESC";
const updateTransactionSql =
    "UPDATE 'transaction' SET amount = ?, categoryId = ?, date = ?, note = ?, toAccountId = ?, fromAccountId = ?, type = ? WHERE id = ?";

const deleteTransactionSql = "DELETE from 'transaction' where  id = ?";
const deleteTransactionByCategorySql =
    "DELETE from 'transaction' where categoryId = ?";
const deleteTransactionByWalletIdSql =
    "DELETE from 'transaction' where toAccountId = ? OR fromAccountId = ?";

const transactionSql = {
    createTransactionTableSql,
    insertTransactionSql,
    updateTransactionSql,
    deleteTransactionSql,
    deleteTransactionByCategorySql,
    selectAllTransactionSql,
    deleteTransactionByWalletIdSql,
};

//Wallet
const createWalletTableSql =
    "CREATE TABLE IF NOT EXISTS wallet (" +
    "id TEXT NOT NULL PRIMARY KEY, " +
    "name TEXT NOT NULL UNIQUE, " +
    "ballance NUMERIC NOT NULL, " +
    "color TEXT NOT NULL)";

const insertWallet =
    "INSERT INTO wallet (id, name, ballance,  color) VALUES ( ?,  ?, ?, ?)";

const updateWalletSql = "UPDATE wallet SET name = ?, color = ? WHERE id = ?";

const updateWalletBallanceSql = "UPDATE wallet SET ballance = ? WHERE id = ?";

const selectAllWalletsSql = "SELECT * from wallet";

const deleteWalletSql = "DELETE from wallet where id = ?";

const walletSql = {
    createWalletTableSql,
    selectAllWalletsSql,
    insertWallet,
    updateWalletSql,
    deleteWalletSql,
    updateWalletBallanceSql,
};

//CustomField
const createCustomFieldsTableSql =
    "CREATE TABLE IF NOT EXISTS custom_field(" +
    "id TEXT NOT NULL PRIMARY KEY, " +
    "name TEXT NOT NULL, " +
    "category TEXT NOT NULL, " +
    "type INTEGER NOT NULL, " +
    "UNIQUE(name, category))";

const insertCustomFieldSql =
    "INSERT INTO custom_field (id, name, category, type) VALUES ( ?, ?, ?, ?)";
const selectCustomFieldsSql = "SELECT * from custom_field";
const updateCustomFieldSql = "UPDATE custom_field SET name = ? WHERE id = ?";
const deleteCustomFieldSql = "DELETE from custom_field where id = ?";

//CustomFieldsListValue
const createCustomFieldListValuesTableSql =
    "CREATE TABLE IF NOT EXISTS custom_field_list_value(" +
    "id TEXT NOT NULL PRIMARY KEY, " +
    "customFieldId TEXT NOT NULL, " +
    "value TEXT NOT NULL, " +
    "UNIQUE(customFieldId, value), " +
    "FOREIGN KEY(customFieldId) REFERENCES custom_field(id))";
const insertCustomFieldListValuesSql =
    "INSERT INTO custom_field_list_value (id, customFieldId, value) VALUES ( ?, ?, ?)";

const selectCustomFieldListValuesSql = "SELECT * from custom_field_list_value";

const updateCustomFieldListValueSql =
    "UPDATE custom_field_list_value SET value = ? WHERE id = ?";

const deleteCustomFieldListValuesByCustomFieldIdSql =
    "DELETE from custom_field_list_value where customFieldId = ?";

const deleteCustomFieldListValuesByIdSql =
    "DELETE from custom_field_list_value where id = ?";

// CustomFieldsValue
const createCustomFieldsValuesTableSql =
    "CREATE TABLE IF NOT EXISTS custom_field_value(" +
    "id TEXT NOT NULL PRIMARY KEY, " +
    "customFieldId TEXT NOT NULL, " +
    "value TEXT, " +
    "transactionId  TEXT NOT NULL, " +
    "FOREIGN KEY(transactionId) REFERENCES 'transaction' (id), " +
    "FOREIGN KEY(customFieldId) REFERENCES custom_field(id))";

const insertCustomFieldValueSql =
    "INSERT INTO custom_field_value (id, customFieldId, value, transactionId) VALUES ( ?, ?, ?, ?)";

const selectCustomFieldValuesSql = "SELECT * from custom_field_value";

const deleteCustomFieldValuesSql =
    "DELETE from custom_field_value where transactionId = ?";

const deleteCustomFieldValuesByCustomFieldIdSql =
    "DELETE from custom_field_value where customFieldId = ?";

const deleteCustomFieldValuesByValueSql =
    "DELETE from custom_field_value where value = ?";

const customFieldSql = {
    createCustomFieldsTableSql,
    insertCustomFieldSql,
    selectCustomFieldsSql,
    updateCustomFieldSql,
    deleteCustomFieldSql,

    createCustomFieldListValuesTableSql,
    insertCustomFieldListValuesSql,
    selectCustomFieldListValuesSql,
    updateCustomFieldListValueSql,
    deleteCustomFieldListValuesByCustomFieldIdSql,
    deleteCustomFieldListValuesByIdSql,

    createCustomFieldsValuesTableSql,
    insertCustomFieldValueSql,
    selectCustomFieldValuesSql,
    deleteCustomFieldValuesSql,
    deleteCustomFieldValuesByCustomFieldIdSql,
    deleteCustomFieldValuesByValueSql,
};

const sql = {
    ...transactionSql,
    ...customFieldSql,
    ...categorySql,
    ...walletSql,
};

export { sql };
