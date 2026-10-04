'use client';

import { useState } from 'react';

import type { TaskItem } from '@/lib/tasks';

import { todoService } from '@/services/todoService';

interface ApiTodoListProps {
  initialTasks: TaskItem[];
}

export default function ApiTodoList({
  initialTasks,
}: ApiTodoListProps) {
  const [tasks, setTasks] =
    useState<TaskItem[]>(initialTasks);

  const handleToggleTask = async (
    id: number,
    currentCompleted: boolean
  ) => {
    console.log(
      'CHECKBOX DIKLIK:',
      id,
      currentCompleted
    );

    const targetStatus =
      !currentCompleted;

    // Optimistic Update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: targetStatus,
            }
          : task
      )
    );

    try {
      console.log(
        'MENGIRIM UPDATE:',
        id,
        targetStatus
      );

      const result =
        await todoService.updateTodoStatus(
          id,
          targetStatus
        );

      console.log(
        'UPDATE API BERHASIL:',
        result
      );
    } catch (error) {
      console.error(
        `Gagal update ke API untuk Todo ${id}:`,
        error
      );

      // Kembalikan UI jika API gagal
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed:
                  currentCompleted,
              }
            : task
        )
      );
    }
  };

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            Tidak ada tugas.
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-xl border p-4 transition ${
              task.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  handleToggleTask(
                    task.id,
                    task.completed
                  )
                }
                className="mt-1 h-5 w-5 cursor-pointer"
              />

              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    task.completed
                      ? 'text-gray-400 line-through'
                      : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </h3>

                <p
                  className={`mt-1 text-sm font-medium ${
                    task.completed
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}
                >
                  {task.completed
                    ? 'Selesai'
                    : 'Pending'}
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                ID: {task.id}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}