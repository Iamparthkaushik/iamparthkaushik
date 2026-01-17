import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'portfolio.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS drawings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_scores_game ON scores(game);
  CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
`);

export default db;

// User functions
export function createUser(username: string, email: string, hashedPassword: string) {
  const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
  return stmt.run(username, email, hashedPassword);
}

export function getUserByEmail(email: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as { id: number; username: string; email: string; password: string; created_at: string } | undefined;
}

export function getUserByUsername(username: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as { id: number; username: string; email: string; password: string; created_at: string } | undefined;
}

export function getUserById(id: number) {
  const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
  return stmt.get(id) as { id: number; username: string; email: string; created_at: string } | undefined;
}

// Score functions
export function addScore(userId: number, game: string, score: number) {
  const stmt = db.prepare('INSERT INTO scores (user_id, game, score) VALUES (?, ?, ?)');
  return stmt.run(userId, game, score);
}

export function getLeaderboard(game?: string, limit = 10) {
  let query = `
    SELECT s.id, s.score, s.game, s.created_at, u.username
    FROM scores s
    JOIN users u ON s.user_id = u.id
  `;
  
  if (game && game !== 'all') {
    query += ` WHERE s.game = ?`;
  }
  
  // For reaction time, lower is better
  if (game === 'reaction') {
    query += ` ORDER BY s.score ASC`;
  } else {
    query += ` ORDER BY s.score DESC`;
  }
  
  query += ` LIMIT ?`;
  
  const stmt = db.prepare(query);
  
  if (game && game !== 'all') {
    return stmt.all(game, limit) as Array<{
      id: number;
      score: number;
      game: string;
      created_at: string;
      username: string;
    }>;
  }
  
  return stmt.all(limit) as Array<{
    id: number;
    score: number;
    game: string;
    created_at: string;
    username: string;
  }>;
}

export function getUserBestScore(userId: number, game: string) {
  const stmt = game === 'reaction'
    ? db.prepare('SELECT MIN(score) as best FROM scores WHERE user_id = ? AND game = ?')
    : db.prepare('SELECT MAX(score) as best FROM scores WHERE user_id = ? AND game = ?');
  return stmt.get(userId, game) as { best: number | null };
}

// Message functions
export function addMessage(userId: number, content: string) {
  const stmt = db.prepare('INSERT INTO messages (user_id, content) VALUES (?, ?)');
  return stmt.run(userId, content);
}

export function getMessages(limit = 50) {
  const stmt = db.prepare(`
    SELECT m.id, m.content, m.created_at, u.username
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
    LIMIT ?
  `);
  return stmt.all(limit) as Array<{
    id: number;
    content: string;
    created_at: string;
    username: string;
  }>;
}

// Drawing functions
export function addDrawing(userId: number, data: string) {
  const stmt = db.prepare('INSERT INTO drawings (user_id, data) VALUES (?, ?)');
  return stmt.run(userId, data);
}

export function getDrawings(limit = 20) {
  const stmt = db.prepare(`
    SELECT d.id, d.data, d.created_at, u.username
    FROM drawings d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
    LIMIT ?
  `);
  return stmt.all(limit) as Array<{
    id: number;
    data: string;
    created_at: string;
    username: string;
  }>;
}
