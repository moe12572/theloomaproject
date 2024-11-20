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
      }
    });

    rl.on('close', () => {
      // Sort notes in descending order to get the latest notes
      notesBuffer.sort((a, b) => b.timestamp - a.timestamp);
      // Return the latest maxNotes
      resolve(notesBuffer.slice(notesBuffer.length - 10, notesBuffer.length));
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
