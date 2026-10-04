'use client';

import { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import type { Todo } from '../types/todo';

type TodoStateOnlyAppProps = {
  initialTodos: Todo[];
};

export default function TodoStateOnlyApp({
  initialTodos,
}: TodoStateOnlyAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title: title,
      description: '',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
  };

  const handleToggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    );
  };

  return (
    <div>
      <TodoForm onAddTodo={handleAddTodo} />

      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
}