"use client";

import DataTester from "./components/DataTester";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50 flex flex-col items-center px-4 py-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          API Interaction Tester
        </h1>
        <p className="text-gray-600 text-lg">
          Enter a user ID to test the recent data API and view mock results.
        </p>
      </header>
      <main className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <DataTester />
      </main>
      <footer className="w-full max-w-4xl text-center mt-8 text-gray-500">
        <p>
          Built with ❤️ using <a href="https://nextjs.org/" className="text-blue-500 hover:underline">Next.js</a> and <a href="https://tailwindcss.com/" className="text-blue-500 hover:underline">Tailwind CSS</a>.
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/moe12572/theloomaproject"
            className="text-blue-600 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Repository on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
