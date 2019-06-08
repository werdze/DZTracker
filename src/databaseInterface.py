import os
import json
# from PIL import Image

import MySQLdb
from flask import Flask, request, jsonify, send_from_directory, flash
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

from src import config
# import config

from werkzeug.datastructures import FileStorage

import boto3

# default Flask port is 5000

app = Flask(__name__)
CORS(app)
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = config.awsConfigInfo
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Alcohol(db.Model):
    id = db.Column(db.INTEGER, primary_key=True, autoincrement=True, nullable=False, unique=True)
    photos = db.Column(db.VARCHAR(1000))
    name = db.Column(db.VARCHAR(200), unique=True, nullable=True)
    company = db.Column(db.VARCHAR(200))
    type = db.Column(db.VARCHAR(200))
    subtype = db.Column(db.VARCHAR(200))
    origin_country = db.Column(db.VARCHAR(200))
    origin_city = db.Column(db.VARCHAR(200))
    rating = db.Column(db.INTEGER)
    comments = db.Column(db.VARCHAR(10000))
    ingredients = db.Column(db.VARCHAR(1000))
    abv = db.Column(db.FLOAT)


    """
    Initializes the model/schema for SQLAlchemy
    """
    def __init__(self, photos, name, company, type, subtype, origin_country, origin_city, rating, comments, ingredients, abv):
        # self.id = id
        self.photos = photos
        self.name = name
        self.company = company
        self.type = type
        self.subtype = subtype
        self.origin_country = origin_country
        self.origin_city = origin_city
        self.rating = rating
        self.comments = comments
        self.ingredients = ingredients
        self.abv = abv


class AlcoholSchema(ma.Schema):
    class Meta:
        fields = ('id', 'photos', 'name', 'company', 'type', 'subtype', 'origin_country', 'origin_city', 'rating', 'comments', 'ingredients', 'abv')


alcohol_schema = AlcoholSchema()
alcohols_schema = AlcoholSchema(many=True)

"""
API endpoint for just entering the basic url without an endpoint
"""
@app.route('/')
def index():
    return 'Try one of these: /alcohol for GET request, /alcohol/<name> for single GET request, /addAlcohol for POST ' \
           'request, /editAlcohol/<id> for PUT request, /deleteAlcohol/<id> for DELETE request, /downloadBackupFile ' \
           'for downloading backup data in a JSON format, or /restoreBackup for restoring a backup from JSON format'

"""
API endpoint for GET method. Returns all entries in database
"""
@app.route("/alcohol", methods=["GET"])
def get_all_alcohol():
    all_alcohols = Alcohol.query.all()
    result = alcohols_schema.dump(all_alcohols)
    return jsonify(result.data)

"""
API endpoint for GET method. Returns a single entry from the database
"""
@app.route("/alcohol/<name>", methods=["GET"])
def get_single_alcohol(name):
    selected_alcohol = Alcohol.query.filter_by(name=name)
    result = alcohols_schema.dump(selected_alcohol)
    return jsonify(result.data)


"""
API endpoint for POST method. Creates a new row in the database
"""
@app.route("/addAlcohol", methods=["POST"])
def add_alcohol():
    json_data = json.loads(request.data)
    photos = json_data['photos']
    name = json_data['name']
    company = json_data['company']
    type = json_data['type']
    subtype = json_data['subtype']
    origin_country = json_data['origin_country']
    origin_city = json_data['origin_city']
    rating = json_data['rating']
    comments = json_data['comments']
    ingredients = json_data['ingredients']
    abv = json_data['abv'] if str(json_data['abv']).replace(".", "").isdigit() else "-1"

    new_entry = Alcohol(photos, name, company, type, subtype, origin_country, origin_city, rating, comments, ingredients, abv)

    db.session.add(new_entry)
    db.session.commit()

    return "200"


"""
API endpoint for PUT method. Updates a row in the database
"""
@app.route("/editAlcohol/<id>", methods=["PUT"])
def edit_alcohol(id):
    alcohol = Alcohol.query.get(id)

    json_data = json.loads(request.data)
    name = json_data['name']
    company = json_data['company']
    type = json_data['type']
    subtype = json_data['subtype']
    origin_country = json_data['origin_country']
    origin_city = json_data['origin_city']
    rating = json_data['rating']
    comments = json_data['comments']
    ingredients = json_data['ingredients']
    abv = json_data['abv'] if str(json_data['abv']).replace(".", "").isdigit() else "-1"

    alcohol.name = name
    alcohol.company = company
    alcohol.type = type
    alcohol.subtype = subtype
    alcohol.origin_country = origin_country
    alcohol.origin_city = origin_city
    alcohol.rating = rating
    alcohol.comments = comments
    alcohol.ingredients = ingredients
    alcohol.abv = abv

    db.session.commit()

    return "200"


"""
API endpoint for DELETE method. Deletes a row from the database
"""
@app.route("/deleteAlcohol/<id>", methods=["DELETE"])
def delete_alcohol(id):
    alcohol = Alcohol.query.get(id)
    db.session.delete(alcohol)
    db.session.commit()

    return "200"


"""
API endpoint for downloading a backup file of the database in json format
"""
@app.route("/downloadBackupFile", methods=['GET', 'POST'])
def download_backup():
    all_alcohols = Alcohol.query.all()
    result = alcohols_schema.dump(all_alcohols)
    json_data = json.dumps(result.data)

    f = open("alcoholBackup.txt", "w")
    f.write(json_data)
    f.close()

    cwd = os.getcwd()
    res = send_from_directory(directory=cwd, filename='alcoholBackup.txt')
    os.remove('alcoholBackup.txt')
    return res


"""
API endpoint for restoring the database to a previous state, as in the backup file
"""
@app.route("/restoreBackup", methods=['POST'])
def restore_backup():
    file_data = json.loads(request.data)

    connection = MySQLdb.connect(host=config.awsHost, user=config.awsUser, passwd=config.awsPasswd, db=config.awsdb)
    cursor = connection.cursor()
    cursor.execute('delete from alcohol')
    connection.commit()

    json_data = json.loads(file_data['data'])

    for entry in json_data:
        photos = entry['photos']
        name = entry['name']
        company = entry['company']
        type = entry['type']
        subtype = entry['subtype']
        origin_country = entry['origin_country']
        origin_city = entry['origin_city']
        rating = entry['rating']
        comments = entry['comments']
        ingredients = entry['ingredients']
        abv = entry['abv']

        new_entry = Alcohol(photos, name, company, type, subtype, origin_country, origin_city, rating, comments, ingredients, abv)
        db.session.add(new_entry)

    db.session.commit()

    return "200"

"""
API endpoint for adding a photo to AWS S3 and to the photos column of a entry in the database
"""
@app.route("/uploadPhoto/<name>", methods=["POST"])
def upload_photo_and_insert_in_database(name):
    # Check if file has been received
    if 'filepond' not in request.files:
        flash('No file part')
        return "error"
    # Save file to cwd
    photo = request.files['filepond']
    photo.save(photo.filename)

    # Set upload info for S3
    bucketName = "drew0"
    Key = photo.filename    # Original Name and type of the file you want to upload into s3
    outPutname = name   # Output file name(The name you want to give to the file after we upload to s3)

    # Connect to S3 and upload the photo file
    s3 = boto3.client('s3')
    r = s3.get_public_access_block(Bucket='drew0')
    s3.upload_file(Key,bucketName,outPutname,ExtraArgs={'ACL':'public-read'})

    # Do file cleanup for the photo file that was created
    if os.path.exists(photo.filename):
        os.remove(photo.filename)
    else:
        print("The file does not exist")

    # Get info for this alcohol name in the database
    selected_alcohol = Alcohol.query.filter_by(name=name)
    result = alcohols_schema.dump(selected_alcohol)
    response_object = jsonify(result.data)
    json_data = json.loads(response_object.data)[0]
    print(json_data)
    print(json_data['abv'])

    # Update the photos column for this alcohol
    alcohol = Alcohol.query.get(json_data['id'])
    photos = json_data['photos']
    alcohol.photos = 'https://s3.us-east-2.amazonaws.com/drew0/' + outPutname
    db.session.commit()

    return "200"

# """
# Fixes the No 'Access-Control-Allow-Origin' header error
# """
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
#     return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80, debug=True)
