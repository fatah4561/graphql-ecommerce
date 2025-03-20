CREATE TABLE shipping_orders (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    address TEXT,
    coordinate_lat DOUBLE PRECISION,
    coordinate_long DOUBLE PRECISION,
    postal_code VARCHAR(15),
    province_id SMALLINT,
    district_id INTEGER,
    city_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);