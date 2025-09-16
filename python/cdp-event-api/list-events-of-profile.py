import http.client
import json
from init_api_config import cdp_api_config
from pathlib import Path
import urllib.parse

connection = http.client.HTTPSConnection(cdp_api_config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": cdp_api_config('tokenkey'),
    "tokenvalue": cdp_api_config('tokenvalue')
}
# print(headers)

#####################################################

# Parameters for the GET request should be URL-encoded into the URI
params = {'primaryEmail': 'trieu@leocdp.com'}
query_string = urllib.parse.urlencode(params)

uri = f'/api/event/list?{query_string}'

connection.request('GET', uri, body=None, headers=headers)
response = connection.getresponse()
response_text = response.read().decode()
json_response = json.loads(response_text)
print(json.dumps(json_response, indent=2, ensure_ascii=False))
