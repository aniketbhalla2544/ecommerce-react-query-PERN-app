-- -------
-- Tables
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  firstname VARCHAR(60) NOT NULL,
  lastname VARCHAR(60),
  email VARCHAR(150) NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  user_id INTEGER,
  title VARCHAR(120) NOT NULL,
  price NUMERIC DEFAULT 1, 
  description TEXT,
  image TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT description_length_check CHECK (LENGTH(description) >= 10),
  CONSTRAINT fk_products_to_user FOREIGN KEY(user_id) REFERENCES users(user_id),
)
-- -------

-- -------
-- Insertions
INSERT INTO products (title, price, description) VALUES
  ('Electric', 149.99, 'Experience unparallel product.'),

SELECT * FROM products ORDER BY product_id;
-- -------

-- -- Selections
-- products
SELECT * FROM products;

-- -------
-- resetting product_id sequence to the current max sequence id
SELECT setval('products_product_id_seq', (SELECT max(product_id) FROM products));
-- -------

-- -------
-- sql script to generate 50 products randomly
SELECT setval('products_product_id_seq', 1, false); 

DO $$
DECLARE
  i INT;
BEGIN
  FOR i IN 1..50 LOOP
    INSERT INTO products (user_id, title, price, description, image, created_at, updated_at)
    VALUES (
      1,
      'Product ' || LPAD(i::TEXT, 3, '0'),
      FLOOR(100 * (RANDOM() * 99 + 1)) / 100,
      LEFT(MD5(RANDOM()::text), 15 + (i % 6)), 
      NULL,
      CURRENT_TIMESTAMP + (i * INTERVAL '1 second'),
      CURRENT_TIMESTAMP + (i * INTERVAL '1 second')
    );
  END LOOP;
END $$;
-- -------

