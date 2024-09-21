from datetime import datetime, timedelta
from init_api_config import cdp_api_config
import sys
import os
import requests
import json
import urllib3
urllib3.disable_warnings()


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

CDP_URL_EVENT_SAVE = 'https://' + \
    cdp_api_config('cdp_host') + '/api/event/save'


def process_data():
    eventdata = {
        "product_code": 1234,
        "branch": "FacialBar Nguyễn Đình Chiều TP.HCM",
        "sender": "user"  # "everon zalo OA"
    }
    tracking_event = {
        'eventtime': "2024-08-18T16:53:46Z",  # Direct example value
        'firstName': 'Thomas',
        'lastName': 'Nguyen',
        'targetUpdatePhone': "0903122280",  # phone
        'targetUpdateEmail': "thomas@example.com",  # email
        'tpname': "Zalo Everon OA",  # Direct example value
        'tpurl': "https://zalo.me/422456864632285156",
        'tprefurl': "",
        'imageUrls': "",
        'metric': "chat-for-support",  # Direct example value
        "jsonData": eventdata,
        "message": "iPhone 15 xịn không ?"
    }
    print(type(tracking_event))
    print(json.dumps(tracking_event, indent=4, ensure_ascii=True))
    cdp_headers = {
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": "*",
        "tokenkey": cdp_api_config('tokenkey'),
        "tokenvalue": cdp_api_config('tokenvalue')
    }
    data = json.dumps(tracking_event)
    # print(data)
    response = requests.post(url=CDP_URL_EVENT_SAVE, headers=cdp_headers, data=data, verify=False)
    response = response.json()
    print(response)


process_data()
