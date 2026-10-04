'use client';

import React, {
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  login,
} from '@/services/authService';


export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError('');

    // Validasi email
    if (email.trim() === '') {
      setError(
        'Email wajib diisi!'
      );
      return;
    }

    // Validasi password
    if (password === '') {
      setError(
        'Password wajib diisi!'
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await login({
          email: email.trim(),
          password,
        });

      if (!response.success) {
        setError(
          response.message ||
            'Login gagal!'
        );
        return;
      }

      // Login berhasil
      router.push('/');

    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat login.'
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="space-y-4">

      {/* Pesan error */}
      {error && (
        <div className="rounded-md bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Masukkan email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            disabled={loading}
          />
        </div>


        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password:
          </label>

          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Masukkan password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            disabled={loading}
          />
        </div>


        {/* Tombol Login */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </button>
        </div>

      </form>


      {/* Link Register */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}

          <Link
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Register di sini
          </Link>
        </p>
      </div>

    </div>
  );
}