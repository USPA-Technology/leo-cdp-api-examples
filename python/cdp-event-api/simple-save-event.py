from decouple import config
import sys
import os
import requests
import json
import urllib3
urllib3.disable_warnings()


from datetime import datetime, timedelta
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

CDP_URL_EVENT_SAVE = 'https://' + config('cdp_host') + '/api/event/save'
TOKEN_KEY_CDP = config('tokenkey')
TOKEN_VALUE_CDP = config('tokenvalue')


headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": config('tokenkey'),
    "tokenvalue": config('tokenvalue')
}

def process_data():
    eventdata = {
        "product_code":1234,
        "branch":"FacialBar Nguyễn Đình Chiều TP.HCM",
        "sender":"user" # "everon zalo OA"
    }
    tracking_event = {
        'eventtime': "2024-08-14T16:53:46Z",  # Direct example value
        'targetUpdateCrmId': "kiotviet-HV01",  # Direct example value
        'tpname': "Zalo Everon OA",  # Direct example value
        'tpurl': "https://zalo.me/422456864632285156",
        'tprefurl': "",
        'imageUrls': "",
        'metric': "chat-for-support",  # Direct example value
        "eventdata": eventdata,
        "message": "sản phẩm giá bao nhiêu ?"
    }
    print(type(tracking_event))
    print(json.dumps(tracking_event, indent=4, ensure_ascii=True))
    cdp_headers = {
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": "*",
        "tokenkey": TOKEN_KEY_CDP,
        "tokenvalue": TOKEN_VALUE_CDP
    }
    data = json.dumps(tracking_event)
   # print(data)
    response = requests.post(url=CDP_URL_EVENT_SAVE, headers=cdp_headers, data=data, verify=False)
    response = response.json()
    print(response)


process_data()
