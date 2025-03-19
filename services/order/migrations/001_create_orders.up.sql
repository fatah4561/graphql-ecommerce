CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    shop_id INT NOT NULL,
    total_amount DECIMAL(15,3) NOT NULL DEFAULT 0,

    -- 0: Pending → Order placed, awaiting payment (for non-COD orders).   
    -- 1: Paid / Payment Pending (COD) → 
    --    - Non-COD: Payment confirmed, order is now ready for processing.  
    --    - COD: Payment will be collected upon delivery.  
    -- 2: Processing → Seller is preparing the order (wrapping, packing, etc.).  
    -- 3: Shipping → Order is in transit.  
    -- 4: Delivered → Order has reached the customer.  
    -- 5: Completed →  
    --    - Non-COD: Buyer confirms receipt (or auto-completes after X days).  
    --    - COD: Buyer pays the delivery agent, order is marked as completed.  
    -- 6: Cancelled → Order was cancelled (by seller, buyer, or due to non-payment).  
    status SMALLINT NOT NULL DEFAULT 0, 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);