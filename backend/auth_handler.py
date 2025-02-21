from flask import request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib

def setup_auth_routes(app):
    CORS(app)

    def init_db():
        conn = sqlite3.connect('backend/database/user.db')
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    # Initialize database
    init_db()

    def hash_password(password):
        return hashlib.sha256(password.encode()).hexdigest()

    @app.route('/api/signup', methods=['POST'])
    def signup():
        try:
            data = request.json
            first_name = data['firstName']
            last_name = data['lastName']
            email = data['email']
            password = hash_password(data['password'])

            conn = sqlite3.connect('backend/database/user.db')
            cursor = conn.cursor()

            try:
                cursor.execute("""
                    INSERT INTO users (first_name, last_name, email, password)
                    VALUES (?, ?, ?, ?)
                """, (first_name, last_name, email, password))

                conn.commit()
                return jsonify({
                    'success': True,
                    'message': 'User registered successfully'
                })

            except sqlite3.IntegrityError:
                return jsonify({
                    'success': False,
                    'message': 'Email already exists'
                }), 409

            finally:
                conn.close()

        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e)
            }), 500

    return app