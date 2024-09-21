import http.client
import json
from init_api_config import cdp_api_config

from datetime import datetime

now = datetime.now()  # current date and time

connection = http.client.HTTPSConnection(cdp_api_config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": cdp_api_config('tokenkey'),
    "tokenvalue": cdp_api_config('tokenvalue')
}
# print(headers)

test_metric = "an-banh-trang"

tracking_event = {
    # the target update profile's email
    'targetUpdatePhone': "0903122290",
    'tpname': "ALPHA TOWER",  # TOUCHPOINT_NAME
    'tpurl': "https://maps.app.goo.gl/RAdDJqiQe5qKvvrx5",  # TOUCHPOINT_URL
    'tprefurl': "",  # TOUCHPOINT_REFERRER_URL
    'funnelStage':"engaged-customer",
    'eventtime': '2024-07-24T10:51:25.110Z',
    # custom event data
    'eventdata': '',
    'imageUrls': "https://ohtea.vn/img/B%C3%A1nh%20tr%C3%A1ng%20cu%E1%BB%91n.jpg",
    'metric': test_metric,
    'tsval': -28000,
    'tspayment': 'momo', # cash, card
    'tscur': 'VND',
    'tsstatus': 'yesy ',
    'message':'test aaaa'
   # 'eventtime': "2024-06-27T17:26:42Z",
}


if test_metric == 'purchase':
    shoppingCartItems = []
    shoppingCartItems.append(
        {'name': 'Chăn hè K-Bedding 200*220KNTS401',
         'itemid': 'kiotviet-'+str(1001105919),
         'idtype': 'item_ID',
         'originalprice': 1900000.0,
         'saleprice': 1140000.0,
         'quantity': 1,
         'currency': 'VND',
         'supplierid': '', 'couponCode': '',
         'fullurl': 'https://www.google.com/search?q=KCBM2022KNTS401',
         'imageurl': 'https://www.everonvn.vn/images/global/everonvn-vn.png'
         }
    )
    transaction_id = "DEMO_TRANSACTION_" + now.strftime("%m/%d/%Y, %H:%M:%S")
    tracking_event['scitems'] = shoppingCartItems
    tracking_event['tsid'] = transaction_id


json_payload = json.dumps(tracking_event)
uri = '/api/event/save'
connection.request('POST', uri, json_payload, headers)

response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
