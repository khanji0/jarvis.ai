from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route for the authentication page
@app.route('/auth')
def auth():
    return render_template('auth.html')

# Route for the about page
@app.route('/about')
def about():
    return render_template('about.html')

# Route for the contact page
@app.route('/contact')
def contact():
    return render_template('contact.html')

# Route to serve static files (e.g., video in the gallery folder)
@app.route('/gallery/<path:filename>')
def serve_gallery(filename):
    return send_from_directory('gallery', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001)