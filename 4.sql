INSERT IGNORE INTO book (
  isbn,
  title,
  author_id,
  publisher_id,
  year_of_publication,
  price,
  stock_quantity
)
SELECT
  s.isbn,
  s.title,
  a.author_id,
  p.publisher_id,
  s.year_of_publication,
  0.00      AS price,
  100       AS stock_quantity
FROM books_staging AS s
JOIN author    AS a ON s.author_name    = a.name
JOIN publisher AS p ON s.publisher_name = p.name;


SET SQL_SAFE_UPDATES = 0;

UPDATE book
SET price = ROUND(RAND()*20 + 5, 2);

SET SQL_SAFE_UPDATES = 1;
