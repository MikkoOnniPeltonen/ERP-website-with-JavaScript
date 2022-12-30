/* DROP DATABASE drink_order IF EXISTS; */
CREATE DATABASE drink_order;
USE drink_order;

CREATE TABLE products  (
	product_id INT PRIMARY KEY,
	product_name VARCHAR(40),
    product_size DECIMAL(1, 2)
);

CREATE TABLE orders  (
	order_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(40),
    order_quantity INT,
    order_received DATETIME,
    order_finished DATETIME,
  	is_ready BOOLEAN
);

