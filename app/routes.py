"""Defining routes"""
from flask import render_template, flash, redirect, url_for, Blueprint
from app import app, db
from app.forms import RegistrationForm, LoginForm
from app.models.user import User
from flask_login import current_user, login_user

    
@app.route('/', strict_slashes=False)
@app.route('/index', strict_slashes=False)
def index():
    """Home page"""
    return render_template('index.html')

    
@app.route('/register', methods=['GET', 'POST'], strict_slashes=False)
def register():
    """Routes for the user registration"""
    form = RegistrationForm()
    if form.validate_on_submit():
        username = form.username.data
        email = form.email.data
        password = form.password.data  # Remember to hash the password securely

        # Check if the username and email are uniques and create the user
        existing_user = User.query.filter_by(username=username).first()
        existing_email = User.query.filter_by(email=email).first()
        if existing_user or existing_email:
            flash('Username or email already exists. Please choose a different one.', 'danger')
        else:
            new_user = User(username=username, email=email, password=password, active=True)
            db.session.add(new_user)
            db.session.commit()
            flash('Your account has been created!', 'success')
            return redirect(url_for('login'))

    return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'], strict_slashes=False)
def login():
    """Route to handle login session"""
    if current_user.is_authenticated:
        return redirect(url_for('searches'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()

        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password', 'danger')
            return redirect(url_for('login'))

        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('searches'))

    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout', methods=['GET', 'POST'], strict_slashes=False)
def logout():
    pass
