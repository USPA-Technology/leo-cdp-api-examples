import http.client
import json
from decouple import config
from pathlib import Path

connection = http.client.HTTPSConnection(config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": config('tokenkey'),
    "tokenvalue": config('tokenvalue')
}

sampleExtAttributes = {}

# set Social Media Profile ID here
sampleSocialMediaProfiles = {"zalo": "123456789", "facebook": "123456789", "linkedin": "123456789"}
sampleIncomeHistory = {"2022-2023": 2000000, "2023-2024": 3000000}

kiotviet_invoice_json = Path('./sample-data/real_kiotviet_invoices.json').read_text()
kiotviet_invoice = json.loads(kiotviet_invoice_json)

profile = {
    "journeyMapIds": "id_default_journey; ",
    "dataLabels": " KOL person; investors",
    "crmRefId": "",
    "governmentIssuedIDs": "",
    'targetUpdateCrmId': "KiotViet-" + kiotviet_invoice["customerCode"],  # customerCode
    "primaryAvatar": "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png",
    "primaryEmail": "",
    "secondaryEmails": "",
    "primaryPhone": "",
    "secondaryPhones": "",
    "firstName": "Thomas",
    "middleName": "Tan",
    "lastName": "Moore",
    "gender": "male",  # or female
    "dateOfBirth": "1986-10-28",  # yyyy-MM-dd
    "livingLocation": "Ho Chi Minh City",  # the address of customer
    "livingCity": "",  # the city where customer is living
    "jobTitles": "Manager",  # the Job Title, e.g: CEO; Manager; Head of Sales
    "workingHistory": "Microsoft",
    # reachable media channels, E.g: facebook; linkedin; chat
    "mediaChannels": "website; facebook; linkedin; ",
    "personalInterests": "coding; business; ",
    "contentKeywords": "history; microsoft; product manament",
    "productKeywords": "history; microsoft; technology",
    "totalCLV": 9000,  # this is example data
    "totalCAC": 999,  # this is example data
    "totalTransactionValue": 200,  # this is example data
    "saleAgencies": "Agency A; Agency B; Agency C",  # the list of sales sources
    "saleAgents": "Mr.Thomas; Ms.Anna",  # the list of sales persons
    "notes": "this is a test",
    "extAttributes": json.dumps(sampleExtAttributes),
    "incomeHistory": json.dumps(sampleIncomeHistory),
    "socialMediaProfiles": json.dumps(sampleSocialMediaProfiles)
}

json_payload = json.dumps(profile)
uri = '/api/profile/save?debug=true'
connection.request('POST', uri, json_payload, headers)

print("uri " + uri)
response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
