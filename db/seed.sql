-- Insert test user (password is "password123" hashed with bcrypt)
INSERT INTO users (id, name, email, password, created_at)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Test User', 
    'test@example.com', 
    '$2a$12$KjYmY/yJd2iP5.G4V9k11OQW08h89m5jZ7a0P1hV.j07W9jDqB20.',
    CURRENT_TIMESTAMP
);

-- Insert 1 test project
INSERT INTO projects (id, name, description, owner_id)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Platform Launch',
    'V1 Release tasks',
    '11111111-1111-1111-1111-111111111111'
);

-- Insert 3 Tasks of different statuses
INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id)
VALUES 
    (
        '33333333-3333-3333-3333-333333333331', 
        'Design UI', 
        'Create initial mockups', 
        'todo', 
        'high', 
        '22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        '33333333-3333-3333-3333-333333333332', 
        'Setup Database', 
        'Initialize PostgreSQL schema', 
        'in_progress', 
        'medium', 
        '22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        '33333333-3333-3333-3333-333333333333', 
        'Configure Docker', 
        'Write docker-compose pipeline', 
        'done', 
        'high', 
        '22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111'
    );
