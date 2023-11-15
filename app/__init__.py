"""Entry point for the flask app"""
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_wtf.csrf import CSRFProtect
from flask_migrate import Migrate
from flask_login import LoginManager

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
csrf = CSRFProtect(app)
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login'


from app import routes
from app.models.user import User
from app.models.search import Search
from app.models.github_data import GithubData


@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
