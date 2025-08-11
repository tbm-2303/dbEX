CREATE TABLE customer (
  customer_id       INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  email             VARCHAR(150) NOT NULL UNIQUE,
  password_hash     VARCHAR(256) NOT NULL,
  registration_date DATE         NOT NULL
);

CREATE TABLE author (
  author_id INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE publisher (
  publisher_id INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE book (
  book_id             INT AUTO_INCREMENT PRIMARY KEY,
  isbn                CHAR(10)       NOT NULL UNIQUE,
  title               VARCHAR(200)   NOT NULL,
  author_id           INT            NOT NULL,
  publisher_id        INT            NOT NULL,
  year_of_publication SMALLINT       NOT NULL,
  price               DECIMAL(10,2)  NOT NULL,
  stock_quantity      INT            NOT NULL,
  FOREIGN KEY (author_id)    REFERENCES author(author_id),
  FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

CREATE TABLE `order` (
  order_id    INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date  DATE        NOT NULL,
  status      VARCHAR(20) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE order_item (
  order_item_id     INT AUTO_INCREMENT PRIMARY KEY,
  order_id          INT NOT NULL,
  book_id           INT NOT NULL,
  quantity          INT NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES `order`(order_id),
  FOREIGN KEY (book_id)  REFERENCES book(book_id)
);





CREATE TABLE books_staging (
  isbn                CHAR(10),
  title               VARCHAR(200),
  author_name         VARCHAR(150),
  publisher_name      VARCHAR(150),
  year_of_publication SMALLINT,
  price               DECIMAL(10,2)
);