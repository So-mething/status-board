CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT CHECK(status IN ('online', 'offline', 'busy')) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(name, date)
);
