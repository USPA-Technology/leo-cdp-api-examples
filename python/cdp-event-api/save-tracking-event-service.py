import http.client
from datetime import datetime
import json
from init_api_config import cdp_api_config

now = datetime.now()  # current date and time
connection = http.client.HTTPSConnection(cdp_api_config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": cdp_api_config('tokenkey'),
    "tokenvalue": cdp_api_config('tokenvalue')
}

# get current datetime in format %Y-%m-%dT%H:%M:%S.%fZ
formatted_datetime = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

spa_name = "Facial Bar Võ Thị Sáu - Trạm chăm sóc da"
touchpoint_url = "https://www.google.com/maps?q=" + spa_name

tracking_event = {
    # the target update profile's email
    'eventtime': '2024-10-17T13:03:25+07:00',
    # 'targetUpdatePhone': "0903122280",  # update by phone
    'targetUpdateCrmId': "zalo-123456789",  # update by CRM ID
    'tpname': spa_name,  # TOUCHPOINT_NAME
    'tpurl': touchpoint_url,  # TOUCHPOINT_URL
    'metric': "purchase",
    'tsval': 600000,
    'tscur': 'VND',
    'tsstatus': 'OK',
    
    'message': 'test',
    'locationName': "Facial Bar Võ Thị Sáu",
    'locationAddress' : "94 Đ. Võ Thị Sáu, Phường Tân Định, Quận 1, Hồ Chí Minh 700000"
}


serviceitems = [{
    "name": "Nâng dưỡng làn da lụa là không tỳ vết",
    "imageurl":"https://fuchsiaspa.com/wp-content/uploads/Facials_Spa-01.jpg",
    "source": "Spa HCM",
    "servicecode": "hcm-002",
    "categoryid": "spa",
    "categoryname":  "Skin Care",
    "originalprice": 600000,
    "saleprice": 450000,
    "quantity": 3,
    "giftquantity" : 1,
    "currency": "VND",
    "expiredat" : '2025-01-01T00:00:01+07:00'
}]

tracking_event['serviceitems'] = serviceitems
transaction_id = "DEMO_TRANSACTION_" + now.strftime("%m/%d/%Y, %H:%M:%S")
tracking_event['tsid'] = transaction_id


json_payload = json.dumps(tracking_event)
uri = '/api/event/save'
connection.request('POST', uri, json_payload, headers)

response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
