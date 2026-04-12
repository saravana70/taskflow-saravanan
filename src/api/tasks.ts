import apiClient from './axios';
import type { Task, CreateTaskPayload } from '../types';

export const createTask = async (projectId: string, payload: CreateTaskPayload): Promise<Task> => {
  const response = await apiClient.post(`/projects/${projectId}/tasks`, payload);
  return response.data;
};

export const updateTask = async (taskId: string, payload: Partial<CreateTaskPayload>): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${taskId}`, payload);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`);
};