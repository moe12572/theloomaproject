import { mockNotes, mockTasks, users } from './__mocks__';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get("user_id"));

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

  const userNotes = mockNotes
    .filter((n) => n.user_id === userId)
    .map(({ note, timestamp }) => ({ name: note, timestamp: timestamp, user_id: userId }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  const userTasks = mockTasks
    .filter((t) => t.user_id === userId)
    .map(({ task, timestamp }) => ({ name: task, timestamp: timestamp, user_id: userId }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(0, 10);

  return new Response(
    JSON.stringify({
      user_id: user.id,
      user_name: user.name,
      tasks: userTasks,
      notes: userNotes,
    }),
    { status: 200 }
  );
}
