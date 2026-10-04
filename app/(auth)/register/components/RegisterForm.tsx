'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  register,
} from '@/services/authService';


export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Validasi nama
    if (name.trim() === '') {
      setError('Nama wajib diisi!');
      return;
    }

    // Validasi email
    if (email.trim() === '') {
      setError('Email wajib diisi!');
      return;
    }

    // Validasi password
    if (password === '') {
      setError('Password wajib diisi!');
      return;
    }

    if (password.length < 6) {
      setError(
        'Password minimal 6 karakter!'
      );
      return;
    }

    // Validasi konfirmasi password
    if (
      password !== confirmPassword
    ) {
      setError(
        'Konfirmasi password tidak sama!'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (!response.success) {
        setError(
          response.message ||
            'Registrasi gagal!'
        );
        return;
      }

      setSuccess(
        'Registrasi berhasil! Silakan login.'
      );

      // Kosongkan form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Pindah ke halaman login
      setTimeout(() => {
        router.push('/login');
      }, 1000);

    } catch (error) {
      console.error(
        'Register error:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat registrasi.'
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Register
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Buat akun baru
        </p>


        {/* Pesan error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* Pesan berhasil */}
        {success && (
          <div className="mb-4 rounded-md bg-green-100 border border-green-300 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Nama */}
          <div>
            <label className="block mb-1 font-medium">
              Nama Lengkap:
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Masukkan nama"
              className="w-full p-3 border rounded-md"
              disabled={loading}
            />
          </div>


          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email:
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Masukkan email"
              className="w-full p-3 border rounded-md"
              disabled={loading}
            />
          </div>


          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              Password:
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Masukkan password"
              className="w-full p-3 border rounded-md"
              disabled={loading}
            />
          </div>


          {/* Konfirmasi Password */}
          <div>
            <label className="block mb-1 font-medium">
              Konfirmasi Password:
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Ulangi password"
              className="w-full p-3 border rounded-md"
              disabled={loading}
            />
          </div>


          {/* Tombol */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Mendaftarkan...'
              : 'Register'}
          </button>

        </form>


        <div className="text-center mt-5 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}

            <Link
              href="/login"
              className="text-blue-600 hover:underline"
            >
              Login di sini
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}