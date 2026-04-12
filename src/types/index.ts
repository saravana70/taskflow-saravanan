// =====================
// USER & AUTH
// =====================

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// =====================
// PROJECT
// =====================

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  tasks?: Task[]; // optional when fetching single project
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

// =====================
// TASK
// =====================


export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  assignee_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string; // Add assignee backing support
  due_date?: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;