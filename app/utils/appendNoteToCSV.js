import fs from 'fs';
import path from 'path';

export const appendNoteToCSV = (userId, timestamp, note) => {
  const csvLine = `\n${timestamp},${userId},${note}`;
  const filePath = path.resolve('app/assets/notes.csv');

  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, csvLine, (err) => {
      if (err) {
        console.error('Error appending to notes.csv:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};