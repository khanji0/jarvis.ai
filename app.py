# from flask import Flask, render_template, send_from_directory, request, jsonify, session, redirect, url_for
# from backend.database.auth_handler import init_db, signup_user, verify_user, get_user_by_email
# from flask_cors import CORS
# import secrets
# from model.chatbot_model import get_jarvis_response  # Import the function to get the AI response
# # Add to the top of app.py
# from dotenv import load_dotenv
# load_dotenv()

# app = Flask(__name__)
# CORS(app)
# app.secret_key = secrets.token_hex(16)  # Generates a secure random key

# # Initialize the database when the app starts
# init_db()

# # Existing routes...
# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/auth')
# def auth():
#     return render_template('auth.html')

# @app.route('/about')
# def about():
#     return render_template('about.html')

# @app.route('/contact')
# def contact():
#     return render_template('contact.html')

# @app.route('/aichat')
# def aichat():
#     # Check if user is logged in
#     if 'user_email' not in session:
#         return redirect(url_for('auth'))
#     user = get_user_by_email(session['user_email'])
#     if not user:
#         session.clear()
#         return redirect(url_for('auth'))
#     return render_template('aichat.html', user=user)

# @app.route('/gallery/<path:filename>')
# def serve_gallery(filename):
#     return send_from_directory('gallery', filename)

# # API endpoint for signup
# @app.route('/api/signup', methods=['POST'])
# def signup():
#     data = request.get_json()

#     # Create username from first name and last name
#     username = f"{data['firstName']} {data['lastName']}"
#     email = data['email']
#     password = data['password']

#     success, message = signup_user(username, email, password)

#     return jsonify({
#         'success': success,
#         'message': message
#     })

# # API endpoint for login
# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     success, message = verify_user(email, password)

#     if success:
#         # Store user info in session
#         session['user_email'] = email
#         user = get_user_by_email(email)
#         return jsonify({
#             'success': True,
#             'message': 'Login successful',
#             'user': user
#         })
#     else:
#         return jsonify({
#             'success': False,
#             'message': message
#         })

# # Logout route
# @app.route('/logout')
# def logout():
#     session.clear()
#     return redirect(url_for('index'))


# @app.route('/api/chat', methods=['POST'])
# def chat():
#     try:
#         data = request.get_json()
#         user_message = data.get('message')

#         if not user_message:
#             return jsonify({
#                 'success': False,
#                 'message': 'No message provided'
#             })

#         # Get AI response from the model
#         ai_response = get_jarvis_response(user_message)

#         # Ensure we have a valid response
#         if ai_response:
#             return jsonify({
#                 'success': True,
#                 'ai_response': ai_response
#             })
#         else:
#             return jsonify({
#                 'success': False,
#                 'message': 'Failed to generate response'
#             })

#     except Exception as e:
#         print(f"Error in chat endpoint: {str(e)}")
#         return jsonify({
#             'success': False,
#             'message': 'Internal server error'
#         })


# # Other routes ...

# if __name__ == '__main__':
#     app.run(debug=True, port=5002)


from flask import Flask, render_template, send_from_directory, request, jsonify, session, redirect, url_for
from backend.database.auth_handler import init_db, signup_user, verify_user, get_user_by_email
from flask_cors import CORS
import secrets
from model.chatbot_model import get_jarvis_response
from dotenv import load_dotenv
import os
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)

# Initialize the database
init_db()

# Main routes
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
    if 'user_email' not in session:
        return redirect(url_for('auth'))
    user = get_user_by_email(session['user_email'])
    if not user:
        session.clear()
        return redirect(url_for('auth'))
    return render_template('aichat.html', user=user)

@app.route('/voice')
def voice():
    if 'user_email' not in session:
        return redirect(url_for('auth'))
    user = get_user_by_email(session['user_email'])
    if not user:
        session.clear()
        return redirect(url_for('auth'))
    return render_template('voice.html', user=user)

# Static file routes
@app.route('/gallery/<path:filename>')
def serve_gallery(filename):
    return send_from_directory('gallery', filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

# Authentication API endpoints
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = f"{data['firstName']} {data['lastName']}"
        email = data['email']
        password = data['password']

        success, message = signup_user(username, email, password)

        return jsonify({
            'success': success,
            'message': message
        })
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An error occurred during signup'
        })

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        success, message = verify_user(email, password)

        if success:
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
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An error occurred during login'
        })

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# Chat API endpoints
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

        ai_response = get_jarvis_response(user_message)

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
        logger.error(f"Chat error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        })

@app.route('/api/voice-chat', methods=['POST'])
def voice_chat():
    try:
        data = request.get_json()
        voice_message = data.get('message')

        if not voice_message:
            return jsonify({
                'success': False,
                'message': 'No voice message provided'
            })

        ai_response = get_jarvis_response(voice_message)

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
        logger.error(f"Voice chat error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        })

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

# Development configuration
if __name__ == '__main__':
    # Set debug mode based on environment variable
    debug_mode = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

    # Set port from environment variable or default to 5002
    port = int(os.getenv('FLASK_PORT', 5002))

    # Run the application
    app.run(
        debug=debug_mode,
        port=port,
        host='0.0.0.0'  # Makes the server externally visible
    )

