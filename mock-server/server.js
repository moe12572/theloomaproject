const express = require('express');
const app = express();
const port = 3001;

// Mock user data
const users = [{ id: 1, name: "John Doe" }];

// Mock notes and tasks
const notes = [
  { timestamp: 1697800000000, user_id: 1, note: "Note 1" },
  { timestamp: 1697900000000, user_id: 1, note: "Note 2" },
];
const tasks = [
  { timestamp: 1697700000000, user_id: 1, task: "Task 1" },
  { timestamp: 1697800000000, user_id: 1, task: "Task 2" },
];

// Merge and sort data
function mergeAndSortData(userId) {
  const userNotes = notes.filter((n) => n.user_id === userId);
  const userTasks = tasks.filter((t) => t.user_id === userId);
  const combined = [...userNotes, ...userTasks];
  return combined.sort((a, b) => a.timestamp - b.timestamp).slice(-10);
}

// API Endpoint
app.get('/api/recent-data', (req, res) => {
  const userId = parseInt(req.query.user_id);
  if (!userId) return res.status(400).send({ error: "user_id is required" });

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).send({ error: "User not found" });

  const sortedData = mergeAndSortData(userId);
  res.json({
    user_id: user.id,
    user_name: user.name,
    data: sortedData,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Mock server running on http://localhost:${port}`);
});
