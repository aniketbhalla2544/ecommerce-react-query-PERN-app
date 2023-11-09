CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  firstname VARCHAR(60) NOT NULL,
  lastname VARCHAR(60),
  email VARCHAR(150) NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
  CONSTRAINT fk_products_to_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

INSERT INTO users (user_id, firstname, lastname, email)
VALUES (1, 'aniket', 'bhalla', 'ab@gmail.com');

DO $$
DECLARE
  i INT;
BEGIN
  FOR i IN 1..20 LOOP
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