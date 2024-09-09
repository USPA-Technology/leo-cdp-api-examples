import http.client
import json
from decouple import config

from datetime import datetime

now = datetime.now()  # current date and time

connection = http.client.HTTPSConnection(config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": config('tokenkey'),
    "tokenvalue": config('tokenvalue')
}
# print(headers)

tracking_event = {
    # the target update profile's email
    'targetUpdatePhone': "0903122290",
    'tpname': "ALPHA TOWER",  # TOUCHPOINT_NAME
    'tpurl': "https://maps.app.goo.gl/RAdDJqiQe5qKvvrx5",  # TOUCHPOINT_URL
    'funnelStage': "customer",
    'eventtime': '2024-09-09T16:51:25.11+07:00',
    # custom event data
    'eventdata': '',
    'imageUrls': "https://kbedding.vn/wp-content/uploads/2022/11/Untitled-design-5.png",
    'metric': "purchase",
    'tsid': 'HD038893',
    'tspayment': 'Tiền mặt',  # cash, card
    'tscur': 'VND',
    'tsstatus': 'COMPLETED',
    'tsvalue': 840000
    # 'eventtime': "2024-06-27T17:26:42Z",
}

orderedItems = []
orderedItems.append(
    {
        'name': 'Chăn hè Microfiber K-Bedding KMP306',
        'itemid': 'odoo-'+str(1001105919),
        'idtype': 'item_ID',
        'originalprice': 840000.0,
        'saleprice': 840000.0,
        'quantity': 1,
        'currency': 'VND',
        'supplierid': '', 'couponCode': '',
        'fullurl': 'https://kbedding.vn/product/chan-he-microfiber-k-bedding-kmp306/',
        'imageurl': 'https://kbedding.vn/wp-content/uploads/2022/11/Untitled-design-5.png'
     }
)
tracking_event['scitems'] = orderedItems


json_payload = json.dumps(tracking_event)
uri = '/api/event/save'
connection.request('POST', uri, json_payload, headers)

response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
