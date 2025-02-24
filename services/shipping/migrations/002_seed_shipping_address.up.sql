-- Insert dummy shipping addresses
INSERT INTO shipping_addresses (user_id, is_favorite, address, coordinate_lat, coordinate_long, postal_code, province_id, district_id, city_id)
VALUES
-- Shipping addresses for user_id 1 (techguy)
(1, TRUE, '123 Tech Street, Downtown', 34.052235, -118.243683, '90001', 10, 101, 1001),
(1, FALSE, '456 Innovation Drive, Tech Park', 34.055000, -118.250000, '90002', 10, 101, 1001),

-- Shipping addresses for user_id 2 (foodlover)
(2, TRUE, '456 Food Avenue, Midtown', 40.712776, -74.005974, '10001', 20, 202, 2002),
(2, FALSE, '789 Gourmet Lane, Food District', 40.715000, -74.010000, '10002', 20, 202, 2002),

-- Shipping addresses for user_id 3 (fashionista)
(3, TRUE, '789 Style Boulevard, Uptown', 51.5074, -0.1278, 'SW1A 1AA', 30, 303, 3003),
(3, FALSE, '321 Trendy Road, Fashion Square', 51.510000, -0.130000, 'SW1A 2AB', 30, 303, 3003),

-- Shipping addresses for user_id 4 (bookworm)
(4, TRUE, '159 Literary Lane, Old Town', 48.8566, 2.3522, '75001', 40, 404, 4004),
(4, FALSE, '753 Novel Street, Booktown', 48.860000, 2.355000, '75002', 40, 404, 4004),

-- Shipping addresses for user_id 5 (automech)
(5, TRUE, '753 Mechanic Road, Industrial Zone', 37.7749, -122.4194, '94101', 50, 505, 5005),
(5, FALSE, '951 Garage Lane, Auto District', 37.780000, -122.425000, '94102', 50, 505, 5005);