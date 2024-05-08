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

profile = {
    "journeyMapIds": "id_default_journey; 1N0iuKVy226Oh8yKLybUaK; ",
    "dataLabels": "DATA_FROM_CDP_API; CRM; KOL person; investors",
    "crmRefId": "123456",
    "governmentIssuedIDs": "US_123",
    "primaryAvatar": "https://www.thelist.com/img/gallery/surprising-things-the-male-body-can-actually-do/intro-1547150254.jpg",
    "primaryEmail": "bill.john@example.com",
    "secondaryEmails": "",
    "primaryPhone": "1234567",
    "secondaryPhones": "(206) 709-3401; (206) 709-3402",
    "firstName": "Bill",
    "middleName": "",
    "lastName": "John",
    "gender": "male",  # or female
    "dateOfBirth": "1955-10-28",  # yyyy-MM-dd
    "livingLocation": " Medina, Washington",  # the address of customer
    "livingCity": "Washington",  # the city where customer is living
    "jobTitles": "Manager",  # the Job Title, e.g: CEO; Manager; Head of Sales
    "workingHistory": "Microsoft",
    # reachable media channels, E.g: facebook; linkedin; chat
    "mediaChannels": "website; facebook; linkedin; ",
    "personalInterests": "coding; business; investment; philanthropist",
    "contentKeywords": "history; microsoft; product manament",
    "productKeywords": "Excel; Word; Microsoft Cloud; Vaccine; technology",
    "totalCLV": 9000,  # this is example data
    "totalCAC": 999,  # this is example data
    "totalTransactionValue": 200,  # this is example data
    "saleAgencies": "Agency A; Agency B; Agency C",  # the list of sales sources
    "saleAgents": "Mr.Thomas; Ms.Anna",  # the list of sales persons
    "notes": "this is a test"
}

json_payload = json.dumps(profile)
uri = '/api/profile/save'
connection.request('POST', uri, json_payload, headers)

print("uri " + uri)
response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
