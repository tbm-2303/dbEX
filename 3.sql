INSERT INTO publisher (name)
SELECT DISTINCT publisher_name
FROM books_staging
WHERE publisher_name IS NOT NULL AND publisher_name <> '';