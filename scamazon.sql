create database scamazon_db;
use scamazon_db;

create table products(
	item_id integer not null auto_increment,
    product_id varchar(50) not null,
    department_name varchar(50) not null,
    price integer default 0,
    stock_quantity integer default 0,
    primary key(item_id)
);

INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Milk Steak","Grocery", 50, 5);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Verm Hat", "Men's Accessories", 25, 10);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Pizza Frizbee", "Sports", 10, 100);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Kitten Mittens", "Pets", 20, 10000);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Fight Milk", "Nutrition", 50, 100);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Dick Towel", "Bed & Bath", 19, 500);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Egg", "Tryin' Times", 0, 1);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Little Green Ghouls", "Toys", 5, 50);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Wolf Cola", "Grocery", 1, 1000);
INSERT INTO products(product_id, department_name, price, stock_quantity)VALUES("Rum Ham", "Grocery", 100, 1);



SELECT * FROM products