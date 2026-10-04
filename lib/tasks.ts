import { todoService } from '@/services/todoService';

import type { Todo } from '@/types/todo';

export type TaskItem = {
  id: number;
  title: string;
  completed: boolean;
};

export function formatApiTodoToTask(
  raw: Todo
): TaskItem {
  return {
    id: raw.id,
    title: raw.todo,
    completed: raw.completed,
  };
}

export async function getTasks(
  page: number = 1,
  perPage: number = 10
): Promise<{
  tasks: TaskItem[];
  total: number;
  limit: number;
  skip: number;
}> {
  try {
    const response =
      await todoService.getTodos(
        page,
        perPage
      );

    const tasks =
      response.data.map(
        formatApiTodoToTask
      );

    const pagination =
      response.meta?.pagination;

    return {
      tasks,
      total:
        pagination?.total ??
        tasks.length,
      limit:
        pagination?.perPage ??
        perPage,
      skip:
        ((pagination?.page ?? page) - 1) *
        (pagination?.perPage ?? perPage),
    };
  } catch (error) {
    console.error(
      '[lib/tasks.ts] Error mengambil tasks dari API:',
      error
    );

    throw error;
  }
}

export async function getTaskById(
  id: number | string
): Promise<Todo | null> {
  try {
    const response =
      await todoService.getTodoById(id);

    return response.data;
  } catch (error) {
    console.error(
      `[lib/tasks.ts] Error mengambil task ID ${id}:`,
      error
    );

    return null;
  }
}

export function getTaskStats(
  tasks: TaskItem[]
) {
  const total = tasks.length;

  const completed =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pending =
    total - completed;

  const completionPercentage =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  return {
    total,
    completed,
    pending,
    completionPercentage,
  };
}