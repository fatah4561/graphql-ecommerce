CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    shop_id INT NOT NULL,
    user_id INT NOT NULL, -- make things easier so we don't need to cross service
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);