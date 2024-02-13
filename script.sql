CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  limit INTEGER NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0
);

/* Credit and Debit */
CREATE TYPE transaction_type AS ENUM ('c', 'd');

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type transaction_type NOT NULL,
  client_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  description TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

DO $$
BEGIN
  INSERT INTO clients (name, limit)
  VALUES
    ('Isaac Newton', 1000 * 100),
    ('Marie Curie', 800 * 100),
    ('Ada Lovelace', 10000 * 100),
    ('Nikola Tesla', 100000 * 100),
    ('Albert Einstein', 5000 * 100);
END; $$