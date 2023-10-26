"""Defining routes"""
from flask import render_template, flash, redirect, url_for, request
from app import app, db
from app.forms import RegistrationForm, LoginForm, SearchForm
from app.models.user import User
from app.models.search import Search
from flask_login import current_user, login_user, login_required, logout_user

    
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
        return redirect(url_for('search'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()

        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password', 'danger')
            return redirect(url_for('login'))

        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('search'))

    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout', strict_slashes=False)
@login_required
def logout():
    logout_user()  
    return redirect(url_for('login'))


@app.route('/search', methods=['GET', 'POST'], strict_slashes=False)
@login_required
def search():
    form = SearchForm()
    if form.validate_on_submit():
        search_query = form.search_query.data
        return redirect(url_for('view_dashboard', username=search_query))

    # Retrieve the 5 most recent searches for the current user
    recent_searches = Search.query.filter_by(user_id=current_user.id).order_by(Search.timestamp.desc()).limit(5).all()
    
    return render_template('searches.html', title='Recent activities', form=form,
                           recent_searches=recent_searches, username=current_user.username)


@app.route('/view_dashboard/<username>', methods=['GET', 'POST'], strict_slashes=False)
@login_required
def view_dashboard(username):
    #the data for this user should be query and store in the database
    #or to build the dashbord directly and serve it to the user.
    #a snap of the dashbord should be taken and the save in the searches table
    # Save the search record to the database
    #search_record = Search(user_id=current_user.id, search_query=search_query, image='path/to/snapshot.png')
    #db.session.add(search_record)
    #db.session.commit()

    return render_template('dashboard.html', username=username)
