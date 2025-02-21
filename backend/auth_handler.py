from flask import Flask, request, jsonify
import sqlite3
import hashlib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Function to hash passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Signup API endpoint
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        # Get the data sent from the frontend
        data = request.json
        first_name = data['firstName']
        last_name = data['lastName']
        email = data['email']
        password = hash_password(data['password'])  # Hash the password for security

        # Connect to the database
        conn = sqlite3.connect('backend/database/user.db')
        cursor = conn.cursor()

        # Try to insert the user into the database
        try:
            cursor.execute("""
                INSERT INTO users (first_name, last_name, email, password)
                VALUES (?, ?, ?, ?)
            """, (first_name, last_name, email, password))

            conn.commit()
            return jsonify({'success': True, 'message': 'User registered successfully'})

        except sqlite3.IntegrityError:
            # Handle duplicate email error
            return jsonify({'success': False, 'message': 'Email already exists'}), 409

        finally:
            conn.close()

    except Exception as e:
        # Handle any other errors
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)  # Use port 5001 instead of 5000