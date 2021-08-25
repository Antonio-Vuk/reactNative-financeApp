CREATE TABLE IF NOT EXISTS category (
    id TEXT NOT NULL PRIMARY KEY, 
    name TEXT NOT NULL UNIQUE, 
    type INTEGER NOT NULL, 
    color TEXT NOT NULL, 
    icon INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS wallet (
    id	TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    ballance NUMERIC NOT NULL,
    color	TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS 'transaction' (
    id TEXT NOT NULL PRIMARY KEY,
    amount	INTEGER NOT NULL,
    categoryId TEXT,
    date TEXT NOT NULL,
    note TEXT,
    toAccountId TEXT, 
    fromAccountId TEXT,
    type INTEGER NOT NULL,
    FOREIGN KEY (toAccountId) REFERENCES wallet (id),
    FOREIGN KEY (fromAccountId) REFERENCES wallet (id),
    FOREIGN KEY (categoryId) REFERENCES category (id)
);
CREATE TABLE IF NOT EXISTS custom_field(
    id	TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    type INTEGER NOT NULL,
    UNIQUE(name, category)
);

CREATE TABLE IF NOT EXISTS custom_field_list_value(
    id	TEXT NOT NULL PRIMARY KEY,
    customFieldId TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(customFieldId, value),
    FOREIGN KEY (customFieldId) REFERENCES custom_field (id)
);


CREATE TABLE IF NOT EXISTS custom_field_value(
    id	TEXT NOT NULL PRIMARY KEY,
    customFieldId TEXT NOT NULL,
    value TEXT,
    transactionId  TEXT NOT NULL,
    FOREIGN KEY (transactionId) REFERENCES 'transaction'  (id),
    FOREIGN KEY (customFieldId) REFERENCES custom_field (id)
);


drop table category;

drop table wallet;

drop table 'transaction';

drop table custom_field;

drop table custom_field_list_value;

drop table custom_field_value;