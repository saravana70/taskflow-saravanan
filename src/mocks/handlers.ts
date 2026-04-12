import { http, HttpResponse } from 'msw';

import type { User, Project, Task, CreateProjectPayload, CreateTaskPayload } from '../types';

type MockUser = User & { password?: string };

const users: MockUser[] = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Test User',
        email: 'test@example.com',
        // password123 
        password: 'password123'
    }
];

const projects: Project[] = [
    {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Platform Launch',
        description: 'V1 Release tasks',
        owner_id: '11111111-1111-1111-1111-111111111111',
        created_at: new Date().toISOString()
    }
];

let tasks: Task[] = [
    {
        id: '55555555-5555-5555-5555-555555555551',
        title: 'Design UI',
        description: 'Create initial mockups',
        status: 'todo',
        priority: 'high',
        assignee_id: '11111111-1111-1111-1111-111111111111',
        project_id: '44444444-4444-4444-4444-444444444444',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '55555555-5555-5555-5555-555555555552',
        title: 'Setup Database',
        description: 'Initialize PostgreSQL schema',
        status: 'in_progress',
        priority: 'medium',
        assignee_id: '11111111-1111-1111-1111-111111111111',
        project_id: '44444444-4444-4444-4444-444444444444',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '55555555-5555-5555-5555-555555555553',
        title: 'Configure Docker',
        description: 'Write docker-compose pipeline',
        status: 'done',
        priority: 'high',
        assignee_id: '11111111-1111-1111-1111-111111111111',
        project_id: '44444444-4444-4444-4444-444444444444',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const handlers = [
    // ================= AUTH =================

    http.post('*/auth/register', async ({ request }) => {
        const body = await request.json() as Record<string, string>;

        if (!body.name || !body.email || !body.password) {
            return HttpResponse.json({ error: 'validation failed' }, { status: 400 });
        }

        const newUser = {
            id: crypto.randomUUID(),
            name: body.name,
            email: body.email,
        };

        users.push({ ...newUser, password: body.password });

        return HttpResponse.json(
            { token: 'fake-token', user: newUser },
            { status: 201 }
        );
    }),

    http.post('*/auth/login', async ({ request }) => {
        const body = await request.json() as Record<string, string>;

        const user = users.find(
            (u) => u.email === body.email && u.password === body.password
        );

        if (!user) {
            return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
        }

        return HttpResponse.json({
            token: 'fake-token',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }),

    // ================= PROJECTS =================

    http.get('*/projects', () => {
        return HttpResponse.json({
            projects,
        });
    }),

    http.post('*/projects', async ({ request }) => {
        const body = await request.json() as CreateProjectPayload;

        if (!body.name) {
            return HttpResponse.json({ error: 'validation failed' }, { status: 400 });
        }

        const newProject = {
            id: crypto.randomUUID(),
            name: body.name,
            description: body.description || '',
            owner_id: '11111111-1111-1111-1111-111111111111',
            created_at: new Date().toISOString(),
        };

        projects.push(newProject);

        return HttpResponse.json(newProject, { status: 201 });
    }),

    http.get('*/projects/:id', ({ params }) => {
        const project = projects.find((p) => p.id === params.id);

        if (!project) {
            return HttpResponse.json({ error: 'not found' }, { status: 404 });
        }

        const projectTasks = tasks.filter((t) => t.project_id === params.id);

        return HttpResponse.json({
            ...project,
            tasks: projectTasks,
        });
    }),

    // ================= TASKS =================

    http.get('*/projects/:id/tasks', ({ params }) => {
        const projectTasks = tasks.filter((t) => t.project_id === params.id);

        return HttpResponse.json({
            tasks: projectTasks,
        });
    }),

    http.post('*/projects/:id/tasks', async ({ params, request }) => {
        const body = await request.json() as CreateTaskPayload;

        const newTask = {
            id: crypto.randomUUID(),
            title: body.title,
            description: body.description || '',
            status: body.status || 'todo',
            priority: body.priority || 'medium',
            assignee_id: body.assignee_id || undefined,
            project_id: params.id as string,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        tasks.push(newTask);

        return HttpResponse.json(newTask, { status: 201 });
    }),

    http.patch('*/tasks/:id', async ({ params, request }) => {
        const body = await request.json() as Partial<Task>;
        const taskIndex = tasks.findIndex((t) => t.id === params.id);
        if (taskIndex === -1) {
            return HttpResponse.json({ error: 'not found' }, { status: 404 });
        }
        tasks[taskIndex] = { ...tasks[taskIndex], ...body, updated_at: new Date().toISOString() };
        return HttpResponse.json(tasks[taskIndex]);
    }),

    http.delete('*/tasks/:id', ({ params }) => {
        tasks = tasks.filter((t) => t.id !== params.id);
        return new HttpResponse(null, { status: 204 });
    }),
];