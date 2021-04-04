import requests
import simplejson as json

path = "http://localhost:3001/file"
payload = {"output" : "This is the output received!"}
headers = {"Content-type": "application/json"}
res = requests.post(path, data= json.dumps(payload), headers=headers)