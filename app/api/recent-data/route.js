export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get("user_id"));

  // Mock user data
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
    { id: 5, name: "Charlie Davis" },
  ];

  // Mock notes and tasks
  const mockNotes = [
    { timestamp: 1697800000000, user_id: 1, note: "Note 1" },
    { timestamp: 1697900000000, user_id: 1, note: "Note 2" },
    { timestamp: 1697800000000, user_id: 2, note: "Note 3" },
    { timestamp: 1697900000000, user_id: 3, note: "Note 4" },
    { timestamp: 1697800000000, user_id: 4, note: "Note 5" },
    { timestamp: 1697900000000, user_id: 5, note: "Note 6" },
  ];
  const mockTasks = [
    { timestamp: 1697700000000, user_id: 1, task: "Task 1" },
    { timestamp: 1697800000000, user_id: 1, task: "Task 2" },
    { timestamp: 1697700000000, user_id: 2, task: "Task 3" },
    { timestamp: 1697800000000, user_id: 3, task: "Task 4" },
    { timestamp: 1697700000000, user_id: 4, task: "Task 5" },
    { timestamp: 1697800000000, user_id: 5, task: "Task 6" },
  ];

  function mergeAndSortData(userId) {
    const userNotes = mockNotes
      .filter((n) => n.user_id === userId)
      .map(({ timestamp, note }) => ({ timestamp, note }));

    const userTasks = mockTasks
      .filter((t) => t.user_id === userId)
      .map(({ timestamp, task }) => ({ timestamp, task }));

    return { tasks: userTasks, notes: userNotes };
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "user_id is required" }), { status: 400 });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return new Response(JSON.stringify({
      error: "User not found. This is using mocks and a test environment. Please enter a user ID from 1 to 5, as those are the available mock data.",
    }),
      { status: 404 }
    );
  }

  const { tasks: sortedTasks, notes: sortedNotes } = mergeAndSortData(userId);

  return new Response(
    JSON.stringify({
      user_id: user.id,
      user_name: user.name,
      tasks: sortedTasks,
      notes: sortedNotes,
    }),
    { status: 200 }
  );
}
