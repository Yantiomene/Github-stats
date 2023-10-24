"""Entry point for the flask app"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/', strict_slashes=False)
def index():
    """Home page"""
    return render_template('index.html')


if __name__ == '__main__':
    """Main launch"""
    app.run(debug=True, host='0.0.0.0', port=5000)
