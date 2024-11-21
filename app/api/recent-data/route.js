import { appendNoteToCSV } from '@/app/utils/appendNoteToCSV';
import { getNotesFromCSV } from '@/app/utils/getNotesFromCSV';
import { mockTasks, users } from './__mocks__';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get('user_id'));
  const connectionStatusNotes = searchParams.get('disconnectNotes') === 'true';
  const connectionStatusTasks = searchParams.get('disconnectTasks') === 'true';

  if (!userId) {
    return new Response(JSON.stringify({ error: 'user_id is required' }), { status: 400 });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return new Response(
      JSON.stringify({
        error:
          'User not found. This is using mocks and a test environment. Please enter a valid user ID.',
      }),
      { status: 404 }
    );
  }

  const abortController = new AbortController();

  // Handle unexpected request closures
  req.signal.addEventListener('abort', () => {
    abortController.abort();
  });

  try {
    // Fetch the ten most recent notes and tasks separately if not disconnected
    const notes = connectionStatusNotes ? [] : await getNotesFromCSV(userId, 10, abortController.signal);
    const tasks = connectionStatusTasks ? [] : await getTasksFromMock(userId);

    // Sort notes and tasks individually in descending order and take the first ten
    const sortedNotes = notes.slice(-10);
    const sortedTasks = tasks.slice(-10);

    // Return the response with both tasks and notes
    return new Response(
      JSON.stringify({
        user_id: userId,
        user_name: user.name,
        tasks: sortedTasks,
        notes: sortedNotes,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Mock function to get tasks for a user
export const getTasksFromMock = async (userId) => {
  const userTasks = mockTasks
    .filter((t) => t.user_id === userId)
    .map(({ task, timestamp, user_id }) => ({ task, timestamp, user_id }))
    .sort((a, b) => a.timestamp - b.timestamp); // Sort in ascending order
  return userTasks;
}

export async function POST(req) {
  try {
    const { userId, note } = await req.json();

    if (!userId || !note) {
      return new Response(JSON.stringify({ error: 'userId and note are required' }), { status: 400 });
    }

    const timestamp = Date.now() * 1000;
    await appendNoteToCSV(userId, timestamp, note);

    // Log the CSV content for debugging
    const fs = require('fs');
    const csvContent = fs.readFileSync('app/assets/notes.csv', 'utf8');

    // Fetch the updated list of notes from the CSV
    const updatedNotes = await getNotesFromCSV(userId);

    return new Response(JSON.stringify({ message: 'Note added successfully', notes: updatedNotes }), { status: 200 });
  } catch (error) {
    console.error('Error adding note:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}