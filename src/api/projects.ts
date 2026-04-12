import apiClient from './axios';
import type { Project, CreateProjectPayload } from '../types';

export const getProjects = async (): Promise<{ projects: Project[] }> => {
  const response = await apiClient.get('/projects');
  return response.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (
  payload: CreateProjectPayload
): Promise<Project> => {
  const response = await apiClient.post('/projects', payload);
  return response.data;
};