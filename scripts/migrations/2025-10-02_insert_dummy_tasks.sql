INSERT INTO tasks (title, description, due_date, status, priority, category, archived, created_at, updated_at)
VALUES
('Overdue Task', 'This task is overdue', NOW() - interval '2 days', 'open', 'high', 'general', false, NOW(), NOW()),
('Today Task 1', 'This task is due today', CURRENT_DATE, 'open', 'medium', 'general', false, NOW(), NOW()),
('Today Task 2', 'Another task due today', CURRENT_DATE, 'open', 'low', 'general', false, NOW(), NOW()),
('Tomorrow Task', 'This task is due tomorrow', CURRENT_DATE + interval '1 day', 'open', 'medium', 'general', false, NOW(), NOW()),
('Future Task', 'This task is due next week', CURRENT_DATE + interval '7 days', 'open', 'low', 'general', false, NOW(), NOW()),
('No Due Date Task 1', 'This task has no due date', NULL, 'open', 'medium', 'general', false, NOW(), NOW()),
('No Due Date Task 2', 'Another no due date task', NULL, 'open', 'high', 'general', false, NOW(), NOW());