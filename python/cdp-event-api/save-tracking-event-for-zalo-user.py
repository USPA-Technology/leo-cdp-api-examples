import http.client
import json
from init_api_config import cdp_api_config

from datetime import datetime

now = datetime.now() # current date and time

connection = http.client.HTTPSConnection(cdp_api_config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": cdp_api_config('tokenkey'),
    "tokenvalue": cdp_api_config('tokenvalue')
}
# print(headers)

test_metric = "purchase"


# get current datetime in format %Y-%m-%dT%H:%M:%S.%fZ
formatted_datetime = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

eventdata  = {"itemId": "2019010113333", "idType" : "SKU", "quantity" : 2}
tracking_event = {
    # the target update profile's email
    'eventtime': '2024-08-14T11:51:25.110Z',
    # Set Zalo User ID here 
    'targetUpdateaSocialMediaID': "zalo:123456789",
    
    'tpname': "Bộ Everon EPC-24041 thuộc bộ sưu tập 2024 - 2025",  # TOUCHPOINT_NAME
    'tpurl': "https://www.everonvn.vn/chi-tiet/everon-epc24041.html",  # TOUCHPOINT_URL
    'tprefurl': "https://google.com",  # TOUCHPOINT_REFERRER_URL
    'eventdata': eventdata,  # custom event data
    'imageUrls': "https://www.everonvn.vn/chi-tiet/images/upload/hinhanh/EPC-24041.jpg",
    'metric': test_metric,
    'tsval': -100,
    'tscur': 'VND',
    'tsstatus': 'transaction OK',
    'message':'test transaction from zalo',
    'locationName': "1 Trần Hưng Đạo, Tp.HCM"
}


if test_metric == 'purchase' :
    shoppingCartItems = []
    shoppingCartItems.append({
        "name": "Bộ chăn bốn mùa Sắc Hạ ESC23002",
        "itemid": "2750",
        "originalprice": 5299000,
        "saleprice": 5299000,
        "quantity": 1,
        "currency": "VND",
        "supplierid": "",
        "couponcode": "",
        "fullurl": "https://everon.com/bo-chan-bon-mua/bo-chan-bon-mua-sac-ha-esc23002-p2750.html",
        "imageurl": "https://everon.com/images/products/2022/10/05/compress_square/4-mua_1664934649.jpg"
    })
    transaction_id = "DEMO_TRANSACTION_" + now.strftime("%m/%d/%Y, %H:%M:%S")
    tracking_event['scitems'] = shoppingCartItems
    tracking_event['tsid'] = transaction_id


json_payload = json.dumps(tracking_event)
uri = '/api/event/save'
connection.request('POST', uri, json_payload, headers)

response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
