-- 1. Display all users
SELECT * FROM users;

-- 2. Display leave requests for a specific user
SELECT * FROM leave_requests WHERE user_id = 1;

-- 3. Count requests by status
SELECT status, COUNT(*) AS total FROM leave_requests GROUP BY status;

-- 4. Find pending requests
SELECT * FROM leave_requests WHERE status = 'PENDING';

-- 5. Find approved requests ordered by date
SELECT * FROM leave_requests WHERE status = 'APPROVED' ORDER BY from_date;

-- 6. Join users with leave requests
SELECT u.name, u.email, lr.leave_type, lr.from_date, lr.to_date, lr.status
FROM users u
JOIN leave_requests lr ON u.id = lr.user_id;

-- 7. Update a request's status
UPDATE leave_requests SET status = 'APPROVED' WHERE id = 1;

-- 8. Delete a pending request
DELETE FROM leave_requests WHERE id = 1 AND status = 'PENDING';
