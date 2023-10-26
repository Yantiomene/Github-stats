"""Defining the search model"""
from datetime import datetime
from app import db
from flask_login import UserMixin


class Search(db.Model):
    __tablename__ = 'searches'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    search_query = db.Column(db.String(255), nullable=False) # username we are quering the dashboard
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    image = db.Column(db.String(255))  # the image file path will be save here

    def __init__(self, user_id, search_query, image=None):
        self.user_id = user_id
        self.search_query = search_query
        self.image = image

    def __repr__(self):
        """Return a string rep of Search"""
        return '<Search {}:{}>'.format(self.id, self.search_query)

    def get_id(self):
        """Return the user id"""
        return str(self.id)
