from flask import Flask, render_template, send_from_directory, request, jsonify, session, redirect, url_for
from backend.database.auth_handler import init_db, signup_user, verify_user, get_user_by_email
from flask_cors import CORS
import secrets
from model.chatbot_model import get_jarvis_response  # Import the function to get the AI response
# Add to the top of app.py
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)  # Generates a secure random key

# Initialize the database when the app starts
init_db()

# Existing routes...
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/auth')
def auth():
    return render_template('auth.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/aichat')
def aichat():
    # Check if user is logged in
    if 'user_email' not in session:
        return redirect(url_for('auth'))
    user = get_user_by_email(session['user_email'])
    if not user:
        session.clear()
        return redirect(url_for('auth'))
    return render_template('aichat.html', user=user)

@app.route('/gallery/<path:filename>')
def serve_gallery(filename):
    return send_from_directory('gallery', filename)

# API endpoint for signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Create username from first name and last name
    username = f"{data['firstName']} {data['lastName']}"
    email = data['email']
    password = data['password']

    success, message = signup_user(username, email, password)

    return jsonify({
        'success': success,
        'message': message
    })

# API endpoint for login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    success, message = verify_user(email, password)

    if success:
        # Store user info in session
        session['user_email'] = email
        user = get_user_by_email(email)
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user
        })
    else:
        return jsonify({
            'success': False,
            'message': message
        })

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')

        if not user_message:
            return jsonify({
                'success': False,
                'message': 'No message provided'
            })

        # Get AI response from the model
        ai_response = get_jarvis_response(user_message)

        # Ensure we have a valid response
        if ai_response:
            return jsonify({
                'success': True,
                'ai_response': ai_response
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to generate response'
            })

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        })


# Other routes ...

if __name__ == '__main__':
    app.run(debug=True, port=5002)

