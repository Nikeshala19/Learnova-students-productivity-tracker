// SQLite data access for Learnova's Tasks screen.
// All data stays on the user's phone. No network or API is used.
import { sampleTasks } from '../data/sampleTasks';

export async function initializeDatabase(db) {
  // execAsync is only used here with fixed SQL, never user input.
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      due TEXT NOT NULL,
      priority TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // Only seed on the first launch. Even if all tasks are later removed,
  // the sample tasks will not be recreated on every app launch.
  const seeded = await db.getFirstAsync(
    'SELECT value FROM app_meta WHERE key = ?',
    'tasks_seeded'
  );
  if (seeded) return;

  await db.withTransactionAsync(async () => {
    const now = Date.now();
    for (const [index, task] of sampleTasks.entries()) {
      await db.runAsync(
        `INSERT OR IGNORE INTO tasks
          (id, title, subject, due, priority, note, completed, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        task.id,
        task.title,
        task.subject,
        task.due,
        task.priority,
        task.note,
        task.completed ? 1 : 0,
        now - index * 1000
      );
    }
    await db.runAsync(
      'INSERT INTO app_meta (key, value) VALUES (?, ?)',
      'tasks_seeded',
      'yes'
    );
  });
}

export async function getTasks(db) {
  const rows = await db.getAllAsync(
    `SELECT id, title, subject, due, priority, note, completed
     FROM tasks ORDER BY created_at DESC, id DESC`
  );
  return rows.map((row) => ({
    ...row,
    completed: row.completed === 1,
  }));
}

export async function insertTask(db, task) {
  await db.runAsync(
    `INSERT INTO tasks
      (id, title, subject, due, priority, note, completed, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    task.id,
    task.title,
    task.subject,
    task.due,
    task.priority,
    task.note,
    task.completed ? 1 : 0,
    Date.now()
  );
}

export async function updateTaskCompletion(db, id, completed) {
  await db.runAsync(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    completed ? 1 : 0,
    id
  );
}
