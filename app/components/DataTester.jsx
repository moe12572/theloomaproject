import { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const DataTester = () => {
  const [userId, setUserId] = useState("");
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