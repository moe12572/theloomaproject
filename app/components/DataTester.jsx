"use client";

import { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function DataTester() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensures the component is mounted in the browser
  }, []);

  const validateForm = () => {
    if (!userId.trim()) {
      setError("User ID is required.");
      return false;
    }
    if (isNaN(userId)) {
      setError("User ID must be a number.");
      return false;
    }
    setError(null);
    return true;
  };

  const fetchData = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`/api/mock?user_id=${userId}`);
      const data = await response.json();

      if (response.status !== 200) {
        setError(data.error || "An error occurred.");
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
  };

  if (!isMounted) return null; // Prevents SSR mismatches

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
        className="flex flex-col gap-4"
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        <label htmlFor="userId" className="text-gray-700 font-medium">
          Enter User ID:
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
          placeholder="e.g., 1"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300"
        >
          Fetch Data
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-2">API Result:</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
