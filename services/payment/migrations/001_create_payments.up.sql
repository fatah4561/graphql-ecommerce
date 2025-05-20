-- append only table, each status change insert new data don't modify or delete
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    gateway VARCHAR(100) NOT NULL, -- 'ipaymu', etc
    method VARCHAR(100) NOT NULL,
    external_id VARCHAR(200) DEFAULT NULL, -- filled from 3rd party response reff_id
    amount DECIMAL(15,3) NOT NULL,
    status VARCHAR(30), -- might need some thoughts since each gateway differ
    metadata JSONB DEFAULT '{}', -- gateway response in json format
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);