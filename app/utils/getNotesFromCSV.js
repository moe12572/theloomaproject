import fs from 'fs';
import readline from 'readline';
import path from 'path';

export const getNotesFromCSV = async (userId, maxNotes = 10, abortSignal) => {
  const notesBuffer = [];
  const fileStream = fs.createReadStream(path.resolve('app/assets/notes.csv'), {
    encoding: 'utf8',
  });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return new Promise((resolve, reject) => {
    rl.on('line', (line) => {
      if (abortSignal?.aborted) {
        rl.close();
        return;
      }

      const [timestampStr, userIdStr, note] = line.split(',');
      const rowUserId = parseInt(userIdStr);

      if (rowUserId === userId) {
        const timestamp = parseInt(timestampStr);
        notesBuffer.push({ timestamp, note, user_id: userId });

        if (notesBuffer.length > maxNotes) {
          // Remove the earliest note to keep the buffer size at maxNotes
          notesBuffer.sort((a, b) => b.timestamp - a.timestamp); // Sort in descending order
          notesBuffer.pop(); // Remove the oldest note
        }
      }
    });

    rl.on('close', () => {
      // Before resolving, sort notes in ascending order
      notesBuffer.sort((a, b) => a.timestamp - b.timestamp);
      resolve(notesBuffer);
    });

    rl.on('error', (err) => {
      console.error('Error reading notes.csv:', err);
      resolve([]); // Return an empty array on error
    });

    // Handle abort signal
    abortSignal?.addEventListener('abort', () => {
      rl.close();
      resolve([]); // Return whatever we have when aborted
    });
  });
};
