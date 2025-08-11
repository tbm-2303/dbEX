INSERT INTO author (name)
SELECT DISTINCT author_name
FROM books_staging
WHERE author_name IS NOT NULL AND author_name <> '';