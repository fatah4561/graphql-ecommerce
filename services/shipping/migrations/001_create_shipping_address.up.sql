CREATE TABLE shipping_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    address TEXT,
    coordinate_lat DOUBLE PRECISION,
    coordinate_long DOUBLE PRECISION,
    postal_code VARCHAR(15),
    province_id SMALLINT,
    district_id INTEGER,
    city_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);