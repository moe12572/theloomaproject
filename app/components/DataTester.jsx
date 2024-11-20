import { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const DataTester = () => {
  const [userId, setUserId] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [disconnectNotes, setDisconnectNotes] = useState(false);
  const [disconnectTasks, setDisconnectTasks] = useState(false);

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
      const response = await fetch(`/api/recent-data?user_id=${userId}&disconnectNotes=${disconnectNotes}&disconnectTasks=${disconnectTasks}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred.");
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err) {
      setError(`Failed to fetch data. Please try again. Error: ${err.message}`);
    }
  };

  const addNote = async () => {
    if (!validateForm() || !note.trim()) {
      setError("Note content is required.");
      return;
    }

    try {
      const response = await fetch('/api/recent-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, note }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred while adding the note.");
      } else {
        setError(null);
        setNote(""); // Clear the note input
        alert("Note added successfully!");
      }
    } catch (err) {
      setError(`Failed to add note. Please try again. Error: ${err.message}`);
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
        {!error ? (
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-4" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  This is using mocks and a test environment. Please enter a user ID from 1 to 5, as those are the available mock data.
                </p>
              </div>
            </div>
          </div>
        ) : (
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
        <label htmlFor="disconnectNotes" className="text-gray-700 font-medium">
          <input
            type="checkbox"
            id="disconnectNotes"
            checked={disconnectNotes}
            onChange={(e) => setDisconnectNotes(e.target.checked)}
            className="mr-2"
          />
          Disconnect Notes Data Source
        </label>
        <label htmlFor="disconnectTasks" className="text-gray-700 font-medium">
          <input
            type="checkbox"
            id="disconnectTasks"
            checked={disconnectTasks}
            onChange={(e) => setDisconnectTasks(e.target.checked)}
            className="mr-2"
          />
          Disconnect Tasks Data Source
        </label>
        <label htmlFor="userId" className="text-gray-700 font-medium">
          Enter User ID:
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
          placeholder="e.g., 1"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300"
        >
          Fetch Data
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Add a New Note:</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNote();
          }}
          className="flex flex-col gap-4"
        >
          <label htmlFor="note" className="text-gray-700 font-medium">
            Note Content:
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter your note here"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:ring focus:ring-green-300"
          >
            Add Note
          </button>
        </form>
      </div>

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

export default DataTester;