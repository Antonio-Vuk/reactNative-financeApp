use finance;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(200) NOT null,
	unique(email)
);

CREATE TABLE IF NOT EXISTS category_type (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    type varchar(50) NOT NULL,
    UNIQUE (type)
);

insert into category_type (type) VALUES('income');

insert into category_type (type) VALUES('expense');

insert into category_type (type) VALUES('both');

CREATE TABLE IF NOT EXISTS custom_field_type (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    type varchar(50) NOT NULL,
    UNIQUE (type)
);

insert into custom_field_type (type) VALUES('text');

insert into custom_field_type (type) VALUES('number');

insert into custom_field_type (type) VALUES('date');

insert into custom_field_type (type) VALUES('list');

CREATE TABLE IF NOT EXISTS transaction_type (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    type varchar(50) NOT NULL,
    UNIQUE (type)
);

insert into transaction_type (type) VALUES('income');

insert into transaction_type (type) VALUES('expense');

insert into transaction_type (type) VALUES('transfer');

CREATE TABLE IF NOT EXISTS category (
    id varchar(50) NOT NULL PRIMARY KEY, 
    name varchar(50) NOT NULL UNIQUE, 
    type INTEGER NOT NULL, 
    color varchar(50) NOT NULL, 
    icon INTEGER NOT NULL,
    userId INT(50) NOT NULL,
    FOREIGN KEY (type) REFERENCES category_type (id),
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS wallet (
    id	varchar(50) NOT NULL PRIMARY KEY,
    name varchar(50) NOT NULL UNIQUE,
    ballance NUMERIC NOT NULL,
    color	varchar(50) NOT NULL,
    userId INT(50) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS custom_field(
    id	varchar(50) NOT NULL PRIMARY KEY,
    name varchar(50) NOT NULL,
    category INTEGER NOT NULL,
    type INTEGER NOT NULL,
    userId INT(50) NOT NULL,
    UNIQUE(name, category),
    FOREIGN KEY (type) REFERENCES custom_field_type (id),
    FOREIGN KEY (userId) REFERENCES users (id)
    
);

CREATE TABLE IF NOT EXISTS custom_field_list_value(
    id	varchar(50) NOT NULL PRIMARY KEY,
    customFieldId varchar(50) NOT NULL,
    value varchar(50) NOT NULL,
    UNIQUE(customFieldId, value),
    FOREIGN KEY (customFieldId) REFERENCES custom_field (id)
);

CREATE TABLE IF NOT EXISTS transaction (
    id varchar(50) NOT NULL PRIMARY KEY,
    amount	INTEGER NOT NULL,
    categoryId varchar(50),
    date varchar(50) NOT NULL,
    note varchar(50),
    toAccountId varchar(50), 
    fromAccountId varchar(50),
    imageUris TEXT,
    location TEXT,
    status TEXT NOT NULL,
    type INTEGER NOT NULL,
    userId INT(50) NOT NULL,
    FOREIGN KEY (type) REFERENCES transaction_type (id),
    FOREIGN KEY (toAccountId) REFERENCES wallet (id),
    FOREIGN KEY (fromAccountId) REFERENCES wallet (id),
    FOREIGN KEY (categoryId) REFERENCES category (id),
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS custom_field_value(
    id	varchar(50) NOT NULL PRIMARY KEY,
    customFieldId varchar(50) NOT NULL,
    value varchar(50),
    transactionId varchar(50) NOT NULL,
    FOREIGN KEY (transactionId) REFERENCES transaction (id),
    FOREIGN KEY (customFieldId) REFERENCES custom_field (id)
);



drop table custom_field_value; 

drop table transaction;

drop table category;

drop table wallet;

drop table custom_field_list_value;

drop table custom_field;

drop table category_type;

drop table custom_field_type;

drop table transaction_type;

drop table users;