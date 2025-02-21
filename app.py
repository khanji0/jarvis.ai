from flask import Flask, render_template, send_from_directory, request, jsonify
from backend.database.auth_handler import init_db, signup_user
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

@app.route('/gallery/<path:filename>')
def serve_gallery(filename):
    return send_from_directory('gallery', filename)

# New API endpoint for signup
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

if __name__ == '__main__':
    app.run(debug=True, port=5002)