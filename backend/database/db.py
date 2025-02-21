import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('backend/database/user.db')
cursor = conn.cursor()

# Create users table with a unique email constraint
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

conn.commit()
conn.close()
