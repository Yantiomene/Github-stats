"""Configuration file"""

from os import getenv


class Config(object):
    GH_MYSQL_USER = getenv('GH_MYSQL_USER')
    GH_MYSQL_PWD = getenv('GH_MYSQL_PWD')
    GH_MYSQL_HOST = getenv('GH_MYSQL_HOST')
    GH_MYSQL_DB = getenv('GH_MYSQL_DB')
    SECRET_KEY = getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{}:{}@{}/{}'.format(GH_MYSQL_USER,
                                                               GH_MYSQL_PWD,
                                                               GH_MYSQL_HOST,
                                                               GH_MYSQL_DB)
