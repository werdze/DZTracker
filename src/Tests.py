import unittest
import requests
import json
import MySQLdb

baseFlaskUrl = 'http://18.216.86.109'


class TestMethods(unittest.TestCase):

    """
    API test for GET
    """
    def test_API_get(self):
        URL = baseFlaskUrl + "/alcohol"
        r = requests.get(url=URL)
        data = r.json()
        self.assertTrue(len(data) > 0)

    """
    API test for single entry GET
    """
    def test_API_single_get(self):
        json_data = {'photos': '', 'name': 'testy', 'company': '', 'type': '', 'subtype': '', 'origin_country': '', 'origin_city': '', 'rating': '', 'comments': '', 'ingredients': '', 'abv': ''}
        URL = baseFlaskUrl + "/addAlcohol"
        r = requests.post(url=URL, data=json.dumps(json_data))
        self.assertTrue(r.status_code == 200)

        URL = baseFlaskUrl + "/alcohol/testy"
        r = requests.get(url=URL)

        connection = MySQLdb.connect(host='tracker0.cr4bvnycc8zr.us-east-2.rds.amazonaws.com', user='tracker0', passwd='tracker0', db='tracker0')
        cursor = connection.cursor()
        cursor.execute('delete from alcohol where name = \'testy\'')
        connection.commit()

        data = r.json()
        self.assertTrue(len(data) > 0)


    """
    API test for POST
    """
    def test_API_post(self):
        json_data = {'photos': '', 'name': 'testy', 'company': '', 'type': '', 'subtype': '', 'origin_country': '', 'origin_city': '', 'rating': '', 'comments': '', 'ingredients': '', 'abv': ''}
        URL = baseFlaskUrl + "/addAlcohol"
        r = requests.post(url=URL, data=json.dumps(json_data))
        self.assertTrue(r.status_code == 200)

        connection = MySQLdb.connect(host='tracker0.cr4bvnycc8zr.us-east-2.rds.amazonaws.com', user='tracker0', passwd='tracker0', db='tracker0')
        cursor = connection.cursor()
        cursor.execute('delete from alcohol where name = \'testy\'')
        connection.commit()

    """
    API test for POST
    """
    def test_API_put(self):
        json_data = {'photos': '', 'name': 'testy', 'company': '', 'type': '', 'subtype': '', 'origin_country': '', 'origin_city': '', 'rating': '', 'comments': '', 'ingredients': '', 'abv': ''}
        URL = baseFlaskUrl + "/addAlcohol"
        r = requests.post(url=URL, data=json.dumps(json_data))
        self.assertTrue(r.status_code == 200)

        URL = baseFlaskUrl + "/alcohol/testy"
        r = requests.get(url=URL)
        data = r.json()

        id = data[0]['id']

        json_data = {'photos': '', 'name': 'testy', 'company': 'testCompany', 'type': '', 'subtype': '', 'origin_country': '', 'origin_city': '', 'rating': '', 'comments': '', 'ingredients': '', 'abv': ''}
        URL = baseFlaskUrl + "/editAlcohol/" + str(id)
        r = requests.put(url=URL, data=json.dumps(json_data))
        self.assertTrue(r.status_code == 200)

        URL = baseFlaskUrl + "/alcohol/testy"
        r = requests.get(url=URL)
        data1 = r.json()

        connection = MySQLdb.connect(host='tracker0.cr4bvnycc8zr.us-east-2.rds.amazonaws.com', user='tracker0', passwd='tracker0', db='tracker0')
        cursor = connection.cursor()
        cursor.execute('delete from alcohol where name = \'testy\'')
        connection.commit()

        self.assertNotEqual(data, data1)

    """
    API test for DELETE
    """
    def test_API_delete(self):
        json_data = {'photos': '', 'name': 'testy', 'company': '', 'type': '', 'subtype': '', 'origin_country': '', 'origin_city': '', 'rating': '', 'comments': '', 'ingredients': '', 'abv': ''}
        URL = baseFlaskUrl + "/addAlcohol"
        r = requests.post(url=URL, data=json.dumps(json_data))
        self.assertTrue(r.status_code == 200)

        URL = baseFlaskUrl + "/alcohol/testy"
        r = requests.get(url=URL)
        data = r.json()
        id = data[0]['id']
        self.assertTrue(len(data) > 0)

        URL = baseFlaskUrl + "/deleteAlcohol/" + str(id)
        r = requests.delete(url=URL)
        self.assertTrue(r.status_code == 200)

        URL = baseFlaskUrl + "/alcohol/testy"
        r = requests.get(url=URL)
        self.assertTrue(len(r.json()) == 0)

    """
    API test for Download Backup File endpoint
    """
    def test_API_download_backup(self):
        URL = baseFlaskUrl + "/downloadBackupFile"
        r = requests.get(url=URL)
        data = r.json()
        self.assertTrue(len(data) > 0)

    """
    API test for Restore Backup endpoint
    """
    def test_API_restore_backup(self):
        URL = baseFlaskUrl + "/downloadBackupFile"
        r = requests.get(url=URL)
        data = r.json()
        json_data = {'data': json.dumps(data)}

        URL = baseFlaskUrl + "/restoreBackup"
        r = requests.get(url=URL, data=json.dumps(json_data))
        self.assertTrue(r.status_code == 200)


if __name__ == '__main__':
    unittest.main()
