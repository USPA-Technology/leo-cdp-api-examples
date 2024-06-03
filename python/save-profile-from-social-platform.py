import http.client
import json
from decouple import config

connection = http.client.HTTPSConnection(config('cdp_host'))

headers = {
    "Content-Type": 'application/json',
    "Access-Control-Allow-Origin": "*",
    "tokenkey": config('tokenkey'),
    "tokenvalue": config('tokenvalue')
}

sampleExtAttributes = {}
sampleSocialMediaProfiles = {"zalo": "123456789"}
sampleIncomeHistory = {"2022-2023": 2000000, "2023-2024": 3000000}

profile = {
    "journeyMapIds": "id_default_journey; ",
    "dataLabels": " KOL person; investors",
    "crmRefId": "",
    "governmentIssuedIDs": "",
    "primaryAvatar": "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png",
    "primaryEmail": "",
    "secondaryEmails": "",
    "primaryPhone": "",
    "secondaryPhones": "",
    "firstName": "Thomas",
    "middleName": "",
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
uri = '/api/profile/save'
connection.request('POST', uri, json_payload, headers)

print("uri " + uri)
response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
