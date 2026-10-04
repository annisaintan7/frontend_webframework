import {
  apiClient,
} from './api';

import type {
  Todo,
} from '@/types/todo';


// ========================================
// RESPONSE API
// ========================================

interface TodoResponse {
  success: boolean;
  message: string;
  data: Todo;
  meta?: {
    timestamp: string;
  };
}

interface TodosResponse {
  success: boolean;
  message: string;
  data: Todo[];
  meta?: {
    timestamp: string;
    pagination?: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  };
}


// ========================================
// CREATE TODO
// ========================================

export interface CreateTodoInput {
  task: string;
}


// ========================================
// UPDATE TODO
// Dynamic Partial Update
// ========================================

export interface UpdateTodoInput {
  task?: string;
  is_completed?: boolean;
}


// ========================================
// TODO SERVICE
// ========================================

export const todoService = {

  // --------------------------------------
  // GET SEMUA TODO
  // --------------------------------------

  async getTodos(
    page: number = 1,
    perPage: number = 10
  ): Promise<TodosResponse> {
    return apiClient<TodosResponse>(
      `/todos?page=${page}&perPage=${perPage}`
    );
  },


  // --------------------------------------
  // GET TODO BERDASARKAN ID
  // --------------------------------------

  async getTodoById(
    id: number | string
  ): Promise<TodoResponse> {
    return apiClient<TodoResponse>(
      `/todos/${id}`
    );
  },


  // --------------------------------------
  // CREATE TODO
  // --------------------------------------

  async createTodo(
    payload: CreateTodoInput
  ): Promise<TodoResponse> {
    return apiClient<TodoResponse>(
      '/todos',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },


  // --------------------------------------
  // UPDATE TODO
  // --------------------------------------

  async updateTodo(
    id: number | string,
    payload: UpdateTodoInput
  ): Promise<TodoResponse> {
    return apiClient<TodoResponse>(
      `/todos/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  },


  // --------------------------------------
  // UPDATE STATUS TODO
  // --------------------------------------

  async updateTodoStatus(
    id: number | string,
    completed: boolean
  ): Promise<TodoResponse> {
    return apiClient<TodoResponse>(
      `/todos/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          is_completed: completed,
        }),
      }
    );
  },


  // --------------------------------------
  // DELETE TODO
  // --------------------------------------

  async deleteTodo(
    id: number | string
  ): Promise<{
    success: boolean;
    message: string;
    data: Record<string, never>;
    meta?: {
      timestamp: string;
    };
  }> {
    return apiClient<{
      success: boolean;
      message: string;
      data: Record<string, never>;
      meta?: {
        timestamp: string;
      };
    }>(
      `/todos/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};