CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    province_id SMALLINT NOT NULL,
    district_id INTEGER NOT NULL,
    city_id INTEGER NOT NULL,
    postal_code INTEGER NOT NULL,
    coordinate VARCHAR(255) NOT NULL,
    icon TEXT,
    opened_at TIMETZ,
    closed_at TIMETZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)