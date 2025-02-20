CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NULL, -- not guest
    session_id INT NULL, -- if guest
    shop_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);