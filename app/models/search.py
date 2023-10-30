"""Defining the search model"""
from datetime import datetime
from app import db
from flask_login import UserMixin


class Search(db.Model):
    __tablename__ = 'searches'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    gh_username = db.Column(db.String(255), nullable=False) # username we are quering the dashboard
    avatar_url = db.Column(db.String(255))
    commits_count = db.Column(db.Integer)
    repos_count = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id, gh_username, avatar_url, commits_count, repos_count):
        self.user_id = user_id
        self.gh_username = gh_username
        self.avatar_url = avatar_url
        self.commits_count = commits_count
        self.repos_count = repos_count

    def __repr__(self):
        """Return a string rep of Search"""
        return '<Search {}:{}>'.format(self.id, self.gh_username)

    def get_id(self):
        """Return the user id"""
        return str(self.id)
