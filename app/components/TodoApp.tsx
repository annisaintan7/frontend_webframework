'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import TodoForm from './TodoForm';

import {
  todoService,
} from '@/services/todoService';

import type {
  Todo,
} from '@/types/todo';

type TodoAppProps = {
  initialTodos?: Todo[];
};

export default function TodoApp({
  initialTodos = [],
}: TodoAppProps) {
  const [todos, setTodos] =
    useState<Todo[]>(initialTodos);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadTodos() {
      try {
        setLoading(true);
        setError('');

        const response =
          await todoService.getTodos(
            1,
            100
          );

        if (response.success) {
          setTodos(response.data);
        }

      } catch (error) {
        console.error(
          'Gagal mengambil todos:',
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : 'Gagal mengambil daftar tugas.'
        );

      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, []);

  const handleAddTodo = async (
    title: string
  ) => {
    try {
      setError('');

      const response =
        await todoService.createTodo({
          task: title,
        });

      if (!response.success) {
        setError(
          response.message ||
            'Gagal menambahkan tugas.'
        );
        return;
      }

      setTodos((currentTodos) => [
        response.data,
        ...currentTodos,
      ]);

    } catch (error) {
      console.error(
        'Gagal menambahkan todo:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Gagal menambahkan tugas.'
      );
    }
  };

  const handleToggleTodo = async (
    id: number,
    completed: boolean
  ) => {
    const oldTodos = [...todos];

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !completed,
            }
          : todo
      )
    );

    try {
      setError('');

      const response =
        await todoService.updateTodoStatus(
          id,
          !completed
        );

      if (!response.success) {
        setTodos(oldTodos);

        setError(
          response.message ||
            'Gagal mengubah status tugas.'
        );
      }

    } catch (error) {
      console.error(
        'Gagal mengubah status todo:',
        error
      );

      setTodos(oldTodos);

      setError(
        error instanceof Error
          ? error.message
          : 'Gagal mengubah status tugas.'
      );
    }
  };

  const handleDeleteTodo = async (
    id: number
  ) => {
    const oldTodos = [...todos];

    setTodos((currentTodos) =>
      currentTodos.filter(
        (todo) => todo.id !== id
      )
    );

    try {
      setError('');

      const response =
        await todoService.deleteTodo(id);

      if (!response.success) {
        setTodos(oldTodos);

        setError(
          response.message ||
            'Gagal menghapus tugas.'
        );
      }

    } catch (error) {
      console.error(
        'Gagal menghapus todo:',
        error
      );

      setTodos(oldTodos);

      setError(
        error instanceof Error
          ? error.message
          : 'Gagal menghapus tugas.'
      );
    }
  };

  return (
    <div className="space-y-6">

      {error && (
        <div className="rounded-md border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <TodoForm
        onAddTodo={handleAddTodo}
      />

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            Memuat daftar tugas...
          </p>
        </div>
      ) : todos.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            Belum ada tugas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`rounded-xl border p-4 transition ${
                todo.completed
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">

                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    handleToggleTodo(
                      todo.id,
                      todo.completed
                    )
                  }
                  className="mt-1 h-5 w-5 cursor-pointer"
                />

                <div className="flex-1">
                  <Link
                    href={`/task/${todo.id}`}
                    className={`font-semibold hover:underline ${
                      todo.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.todo}
                  </Link>

                  <p
                    className={`mt-1 text-sm font-medium ${
                      todo.completed
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {todo.completed
                      ? 'Selesai'
                      : 'Pending'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteTodo(todo.id)
                  }
                  className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
                >
                  Hapus
                </button>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  ID: {todo.id}
                </span>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}