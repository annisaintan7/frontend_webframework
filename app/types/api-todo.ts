export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
}

export interface TaskItem {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodosApiResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}