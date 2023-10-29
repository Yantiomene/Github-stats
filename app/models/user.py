"""Defining the User model"""
from datetime import datetime
from app import db  # Import the SQLAlchemy object from the Flask app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean, default=True)

    # Define the relationship with GithubData
    github_data = db.relationship('GithubData', back_populates='user', uselist=False)

    def __init__(self, username, email, password, active=True):
        self.username = username
        self.email = email
        self.active = active
        self.password_hash = generate_password_hash(password)


    def __repr__(self):
        """Return a string rep of User"""
        return '<User {}:{}>'.format(self.id, self.username)
    

    def set_password(self, password):
        """Set the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if the provided password matches the user's stored password."""
        return check_password_hash(self.password_hash, password)

    def is_active(self):
        """Check if the user's account is active."""
        return self.active

    def get_id(self):
        """Return the user id"""
        return str(self.id)
