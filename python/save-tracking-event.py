import http.client
import json

connection = http.client.HTTPSConnection('leocdp.example.com')

headers = {'Content-Type': 'application/json',
           "Access-Control-Allow-Origin": "*",
           "tokenkey": "default_access_key",
           "tokenvalue": "7091411_4Z5CKFqjUxJHpIEohZIQXf"}

tracking_event = {
    # the target update profile's email
    'targetUpdateEmail': "media@gatesfoundation.org",
    'tpname': "TP bank",  # TOUCHPOINT_NAME
    'tpurl': "https://tpb.vn",  # TOUCHPOINT_URL
    'tprefurl': "https://google.com",  # TOUCHPOINT_REFERRER_URL
    'eventdata': "{'source':'test api'}",  # custom event data
    'imageUrls': "https://onlinebank.com.vn/wp-content/uploads/2019/10/tpbank.jpg",
    'metric': "check-in"
}

json_payload = json.dumps(tracking_event)
uri = '/api/event/save'
connection.request('POST', uri, json_payload, headers)

response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
