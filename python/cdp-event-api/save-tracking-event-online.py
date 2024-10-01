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

print(headers)

test_metric = "purchase"


# get current datetime in format %Y-%m-%dT%H:%M:%S.%fZ
formatted_datetime = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

eventdata = {"itemId": "2019010113333", "idType": "SKU",
             "quantity": 2, "ghi chú": "khuyến mãi 20% <b> rất hot </b>"}
tracking_event = {
    # the target update profile's email
    'eventtime': '2024-09-28T16:57:25+7:00',
    'targetUpdatePhone': "0903122280",  # phone
    'tpname': "Everon Kinh Duong Vuong",  # TOUCHPOINT_NAME
    'tpurl': "https://everonvn.com.vn/everon/3662/bo-everon-epm-24060",  # TOUCHPOINT_URL
    'tprefurl': "https://google.com",  # TOUCHPOINT_REFERRER_URL
    'eventdata': eventdata,  # custom event data
    #  'imageUrls': "https://www.everonvn.vn/chi-tiet/images/upload/hinhanh/EPC-24041.jpg",
    'metric': test_metric,
    'tsval': 2694100,
    'tscur': 'VND',
    'tsstatus': 'OK',

    'tstax': 10.1,
    'tsshippingvalue': 30000,
    'tsshippinginfo': {"address": "151 - 155 Đ. Bến Vân Đồn, Phường 6, Quận 4, Thành phố Hồ Chí Minh 754522, Việt Nam"},

    'message': 'test',
    'locationName': "1 Trần Hưng Đạo, Tp.HCM",
    'sourceip': '42.115.94.101',
    'useragent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
}


if test_metric == 'purchase':
    shoppingCartItems = [{
        "name": "Bộ Everon ESC 23002 – Everon 379",
        "itemid": "2750",
        "idtype": "item_ID",
        "originalprice":  199000,
        "saleprice": 179100,
        "quantity": 1,
        "currency": "VND",
        "supplierid": "",
        "couponcode": "",
        "fullurl": "https://everonvn.com.vn/everon/3662/bo-everon-epm-24060",
        "imageurl": "https://product.hstatic.net/200000514721/product/320884299_513929560521602_5292932644256658938_n_ffcd2718404248b3bedc2e30ec033909_master.jpeg"
    },
    {
        "name": "Bộ Everon Esm-21017",
        "description": "test item",
        "itemid": "2751",
        "idtype": "item_ID",
        "originalprice":  2239000,
        "saleprice": 2515000,
        "quantity": 1,
        "currency": "VND",
        "supplierid": "",
        "couponcode": "",
        "fullurl": "https://everonvn.com.vn/everon/3662/bo-everon-epm-24060",
        "imageurl": "https://everonvn.com.vn/media/CK/images/2024/epm-24060.jpg",
        "categoryid": "",
        "categoryname": "",
        "productcode": "24060"
    }]
    transaction_id = "DEMO_TRANSACTION_" + now.strftime("%m/%d/%Y, %H:%M:%S")
    tracking_event['scitems'] = shoppingCartItems
    tracking_event['tsid'] = transaction_id


json_payload = json.dumps(tracking_event)
uri = '/api/event/save'
connection.request('POST', uri, json_payload, headers)

response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
