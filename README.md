# Github Stats
This is a Github Stats app that uses the Github API to display the user's Github stats.

## Getting Started
To get started, you will need to create a Github OAuth App. You can do so by following the instructions [here](https://docs.github.com/en/developers/apps/creating-an-oauth-app).

clone the repo
```bash
git clone https://github.com/Yantiomene/Github-stats
```

cd into the repo
```bash
cd Github-stats
```

start a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

install the dependencies
```bash
pip install -r requirements.txt
```

create a .env file and add the following and add the following environment variables
```bash
GH_MYSQL_USER=<your mysql username>
GH_MYSQL_PASSWORD=<your mysql password>
GH_MYSQL_HOST=<your mysql host>
GH_MYSQL_DB=<your mysql database>
SECRET_KEY=<your secret key>
GH_TOKEN=<your github token>
```

start the flask server
```bash
flask run
```

## Built With
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) - The web framework used
* [Github API](https://docs.github.com/en/rest) - The API used

## Authors
* [Yaninthe](https://github.com/Yantiomene/)
* [Esmond](https://github.com/esmond-adjei/)
* [Gregory](https://github.com/GHMatrix/)

