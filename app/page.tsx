import TodoApp from './components/TodoApp';

export default function TodoPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-xl bg-white px-10 py-10 shadow-lg">

        <header className="mb-10 border-b border-gray-400 pb-6">
          <h1 className="text-center text-4xl font-bold text-gray-900">
            Daftar Tugas (Todo List)
          </h1>
        </header>

        <TodoApp />

      </div>
    </main>
  );
}