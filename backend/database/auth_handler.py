# auth_handler.py
import sqlite3
from werkzeug.security import generate_password_hash
import os

def init_db():
    db_path = os.path.join(os.path.dirname(__file__),  'user.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # Create users table if it doesn't exist
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()

def signup_user(username, email, password):
    try:
        db_path = os.path.join(os.path.dirname(__file__), 'user.db')
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        # Check if email already exists
        c.execute('SELECT email FROM users WHERE email = ?', (email,))
        if c.fetchone() is not None:
            conn.close()
            return False, "Email already registered"

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Insert new user
        c.execute('''
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        ''', (username, email, hashed_password))

        conn.commit()
        conn.close()
        return True, "Signup successful"

    except Exception as e:
        print(f"Database error: {str(e)}")
        return False, f"Database error: {str(e)}"