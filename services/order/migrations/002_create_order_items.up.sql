CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(15,3) NOT NULL,
    subtotal DECIMAL(15,3) GENERATED ALWAYS AS (price * quantity) STORED,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);