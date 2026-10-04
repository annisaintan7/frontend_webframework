'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import TaskDetailCard from './components/TaskDetailCard';
import TaskNotFound from './components/TaskNotFound';

import {
  isAuthenticated,
} from '@/services/authService';

import {
  todoService,
} from '@/services/todoService';

import type {
  Todo,
} from '@/types/todo';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [todo, setTodo] =
    useState<Todo | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const id = params.id;

    if (
      !id ||
      Array.isArray(id)
    ) {
      setError(true);
      setLoading(false);
      return;
    }

    const todoId = id;

    async function loadTodo() {
      try {
        setLoading(true);
        setError(false);

        const response =
          await todoService.getTodoById(
            todoId
          );

        if (
          response.success &&
          response.data
        ) {
          setTodo(response.data);
        } else {
          setError(true);
        }

      } catch (error) {
        console.error(
          'Gagal mengambil detail task:',
          error
        );

        setError(true);

      } finally {
        setLoading(false);
      }
    }

    loadTodo();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">
            Memuat detail tugas...
          </p>
        </div>
      </main>
    );
  }

  if (error || !todo) {
    const id = Array.isArray(params.id)
      ? params.id[0]
      : params.id;

    return (
      <TaskNotFound
        id={id ?? ''}
      />
    );
  }

  return (
    <TaskDetailCard
      todo={todo}
    />
  );
}