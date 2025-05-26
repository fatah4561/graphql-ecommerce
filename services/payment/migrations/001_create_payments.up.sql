-- append only table, each status change insert new data don't modify or delete
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    gateway VARCHAR(100) NOT NULL, -- 'ipaymu', etc
    method VARCHAR(100) NOT NULL,
    external_id VARCHAR(200) DEFAULT NULL, -- filled from 3rd party response reff_id, transaction_id, etc
    amount DECIMAL(15,3) NOT NULL,
    status SMALLINT, -- 0:PENDING, 1:PAID, 2:FAILED, 3:CANCELLED
    metadata JSONB DEFAULT '{}', -- gateway response in json format
    note VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);