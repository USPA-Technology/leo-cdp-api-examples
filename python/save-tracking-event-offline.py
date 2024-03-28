import http.client
import json
from decouple import config

from datetime import datetime

now = datetime.now() # current date and time

connection = http.client.HTTPSConnection(config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": config('tokenkey'),
    "tokenvalue": config('tokenvalue')
}
# print(headers)

test_metric = "qr-code-scan"

tracking_event = {
    # the target update profile's email
    'targetUpdatePhone': "2067093400",
    'tpname': "Bộ chăn bốn mùa Sắc Hạ ESC23002",  # TOUCHPOINT_NAME
    'tpurl': "https://maps.app.goo.gl/YpdoePpFMTCycSCZ9",  # TOUCHPOINT_URL
    'tprefurl': "",  # TOUCHPOINT_REFERRER_URL
    'eventdata': '{"itemtId": "2750", "idType" : "item_ID", quantity : 1}',  # custom event data
    'imageUrls': "https://everon.com/upload_images/images/dia-chi-mua-cha-ga-goi-everon/mua-dem-everon-chinh-hang-o-dau-3.jpg",
    'metric': test_metric
}


if test_metric == 'purchase' :
    shoppingCartItems = [];
    shoppingCartItems.append({
        "name": "Bộ chăn bốn mùa Sắc Hạ ESC23002",
        "itemtId": "2750",
        "idType": "item_ID",
        "originalPrice": 5299000,
        "salePrice": 5299000,
        "quantity": 1,
        "currency": "VND",
        "supplierId": "",
        "couponCode": "",
        "fullUrl": "https://everon.com/bo-chan-bon-mua/bo-chan-bon-mua-sac-ha-esc23002-p2750.html",
        "imageUrl": "https://everon.com/images/products/2022/10/05/compress_square/4-mua_1664934649.jpg"
    })
    transaction_id = "DEMO_TRANSACTION_" + now.strftime("%m/%d/%Y, %H:%M:%S")
    tracking_event['scitems'] = json.dumps(shoppingCartItems)
    tracking_event['tsid'] = transaction_id


json_payload = json.dumps(tracking_event)
uri = '/api/event/save'
connection.request('POST', uri, json_payload, headers)

response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
