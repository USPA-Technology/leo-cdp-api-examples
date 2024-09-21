import http.client
import json
from init_api_config import cdp_api_config
from pathlib import Path

from datetime import datetime, timezone, timedelta

now = datetime.now()  # current date and time

kiotviet_invoice_json = Path('./sample-data/real_kiotviet_invoices.json').read_text()
kiotviet_invoice = json.loads(kiotviet_invoice_json)

connection = http.client.HTTPSConnection(cdp_api_config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": cdp_api_config('tokenkey'),
    "tokenvalue": cdp_api_config('tokenvalue')
}
# print(headers)

#####################################################

def convert_kiotviettime_to_CDP_time(datetime_str):
  return datetime_str.split('.')[0] + 'Z'


def kiotviet_to_cdp(kiotviet_data):
    """
    Converts KiotViet order data to CDP event format.

    Args:
        kiotviet_data (dict): KiotViet order data as a dictionary.

    Returns:
        list: A list of CDP events, each representing a product in the order.
    """

    cdp_events = []

    for item in kiotviet_data["invoiceDetails"]:
        # TODO check item to map data 
        cdp_event = {
            "name": item["productName"],
            "itemid": item["productId"],  # Assuming productId is the item ID
            "idtype": "item_ID",
            # Assuming price is the original price
            "originalprice": item["price"],
            "saleprice": item["price"] - item["discount"],
            "quantity": item["quantity"],
            "currency": "VND",
            "supplierid": "",  # Not available in KiotViet data
            "couponcode": "",  # Not available in KiotViet data
            # Not available in KiotViet data
            "fullurl": 'uri://productCode:' + item["productCode"],
            "imageurl": ""  # Not available in KiotViet data
        }

        cdp_events.append(cdp_event)

    return cdp_events


event_name_metric = "purchase"

tracking_event = {
    # the target update profile's CRM ID
    'eventtime': convert_kiotviettime_to_CDP_time(kiotviet_invoice["purchaseDate"]),
    'targetUpdateCrmId': "KiotViet-" + kiotviet_invoice["customerCode"],  # customerCode
    'tpname': kiotviet_invoice["soldByName"],  # soldByName
    'tpurl': "https://maps.google.com?q=" + str(kiotviet_invoice["branchName"]),  # branchName
    'tprefurl': "",  
    'rawJsonData': kiotviet_invoice_json,  # custom event data
    'eventData': kiotviet_invoice,
    'imageUrls': "",
    'metric': event_name_metric
}



if event_name_metric == 'purchase':
    tracking_event['tsid'] = kiotviet_invoice["code"]  # code
    tracking_event['tscur'] = "VND"
    tracking_event['tsval'] = kiotviet_invoice["totalPayment"]  # code
    #items = kiotviet_to_cdp(kiotviet_invoice)
   # tracking_event['scitems'] = items
    

json_payload = json.dumps(tracking_event)
print(json_payload)

uri = '/api/event/save'

connection.request('POST', uri, json_payload, headers)
response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
