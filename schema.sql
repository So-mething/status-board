-- D1 database schema for status board
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT CHECK(status IN ('online', 'offline', 'busy')) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Sample data
INSERT INTO users (name, status) VALUES ('Alice', 'online');
INSERT INTO users (name, status) VALUES ('Bob', 'busy');
INSERT INTO users (name, status) VALUES ('Charlie', 'offline');
