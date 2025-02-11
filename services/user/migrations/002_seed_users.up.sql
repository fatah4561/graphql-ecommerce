-- Insert users ( the password is "password" ), this is meant to be dummy
INSERT INTO users (username, email, password_hash)
VALUES
('techguy', 'techguy@example.com', '$2a$10$PoD3fybXkeIiVeaGgtHGR.SxEwivWQKCop6y/VjgfD.D9z/yGLs1G'),
('foodlover', 'foodlover@example.com', '$2a$10$PoD3fybXkeIiVeaGgtHGR.SxEwivWQKCop6y/VjgfD.D9z/yGLs1G'),
('fashionista', 'fashionista@example.com', '$2a$10$PoD3fybXkeIiVeaGgtHGR.SxEwivWQKCop6y/VjgfD.D9z/yGLs1G'),
('bookworm', 'bookworm@example.com', '$2a$10$PoD3fybXkeIiVeaGgtHGR.SxEwivWQKCop6y/VjgfD.D9z/yGLs1G'),
('automech', 'automech@example.com', '$2a$10$PoD3fybXkeIiVeaGgtHGR.SxEwivWQKCop6y/VjgfD.D9z/yGLs1G');

-- Insert user details
INSERT INTO user_details (user_id, fullname, address, province_id, district_id, city_id)
VALUES
(1, 'John Tech', '123 Tech Street, Downtown', 10, 101, 1001),
(2, 'Alice Foodie', '456 Food Avenue, Midtown', 20, 202, 2002),
(3, 'Emma Style', '789 Style Boulevard, Uptown', 30, 303, 3003),
(4, 'David Reader', '159 Literary Lane, Old Town', 40, 404, 4004),
(5, 'Michael Mechanic', '753 Mechanic Road, Industrial Zone', 50, 505, 5005);
