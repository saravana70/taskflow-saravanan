import apiClient from './axios';
import type { LoginCredentials, RegisterCredentials } from '../types';

// Login
export const loginUser = async (credentials: LoginCredentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

// Register
export const registerUser = async (credentials: RegisterCredentials) => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};