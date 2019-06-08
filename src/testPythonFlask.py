import os

from flask import Flask

# default Flask port is 5000

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))


"""
API endpoint for just entering the basic url without an endpoint
"""
@app.route('/')
def index():
    return 'Try one of these: /alcohol for GET request, /alcohol/<name> for single GET request, /addAlcohol for POST ' \
           'request, /editAlcohol/<id> for PUT request, /deleteAlcohol/<id> for DELETE request, /downloadBackupFile ' \
           'for downloading backup data in a JSON format, or /restoreBackup for restoring a backup from JSON format'


if __name__ == '__main__':
    app.run(debug=True)
