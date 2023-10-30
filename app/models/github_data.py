from app import db
from datetime import datetime


class GithubData(db.Model):
    """Defines the GithubData model"""

    __tablename__ = 'github_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    github_username = db.Column(db.String(200))
    github_user = db.Column(db.JSON)
    repositories = db.Column(db.JSON)
    activities = db.Column(db.JSON)
    skills = db.Column(db.JSON)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Define the relationship with the Users table
    user = db.relationship('User', back_populates='github_data')

    def __init__(self, user_id, github_username, github_user, repositories, activities, skills):
        self.user_id = user_id
        self.github_username = github_username
        self.github_user = github_user
        self.repositories = repositories
        self.activities = activities
        self.skills = skills


    def __rep__(self):
        """Return a string representation of a githubData instance"""
        return "<GithubData {}:{}>".format(self.id, self.github_username)

    # Add other methods or properties as needed
