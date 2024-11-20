import { NextResponse } from "next/server";

const users = [{ id: 1, name: "John Doe" }];
const notes = [
  { timestamp: 1697800000000, user_id: 1, note: "Note 1" },
  { timestamp: 1697900000000, user_id: 1, note: "Note 2" },
];
const tasks = [
  { timestamp: 1697700000000, user_id: 1, task: "Task 1" },
  { timestamp: 1697800000000, user_id: 1, task: "Task 2" },
];

function mergeAndSortData(userId) {
  const userNotes = notes.filter((n) => n.user_id === userId);
  const userTasks = tasks.filter((t) => t.user_id === userId);
  const combined = [...userNotes, ...userTasks];
  return combined.sort((a, b) => a.timestamp - b.timestamp).slice(-10);
}

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const userId = parseInt(searchParams.get("user_id"));

  if (!userId) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

  const user = users.find((u) => u.id === userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const sortedData = mergeAndSortData(userId);

  return NextResponse.json({
    user_id: user.id,
    user_name: user.name,
    data: sortedData,
  });
}
