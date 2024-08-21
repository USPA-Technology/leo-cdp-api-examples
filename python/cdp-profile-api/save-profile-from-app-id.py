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

sampleExtAttributes = {"facebook-friend": 10, "facebook-short-bio": "#Dataism #LEOCDP #InGodWeTrust"}
applicationIDs = ['kiotviet-KH410273','zalo-1234']
sampleIncomeHistory = {"2022-2023": 2000000, "2023-2024": 3000000}

profile = {
    "journeyMapIds": "id_default_journey; ",
    "dataLabels": "CRM;test",
    "crmRefId": "123",
    "governmentIssuedIDs": "",
    "primaryAvatar": "",
    "primaryEmail": "tantrieuf31@gmail.com",
    "secondaryEmails": "",
    "primaryPhone": "0903122290",
    "secondaryPhones": "(206) 709-3401; (206) 709-3402",
    "firstName": "Bill",
    "middleName": "",
    "lastName": "John 12345",
    "gender": "male",  # or female
    "dateOfBirth": "1990-08-05",  # yyyy-MM-dd
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
    "notes": "this is a test",
    "extAttributes": json.dumps(sampleExtAttributes),
    "incomeHistory": json.dumps(sampleIncomeHistory),
    # identities 
    "applicationIDs": json.dumps(applicationIDs),
    "socialMediaProfiles": json.dumps({"zalo": "123456789", "facebook": "123456789", "linkedin": "123456789"}),
    "loyaltyIDs": json.dumps(['kiotviet-KH410273','dpoint-1234']),
    "fintechSystemIDs": json.dumps(['bank-123','bank-456']),
    "governmentIssuedIDs": json.dumps(['cccd-123','cccd-456'])
}

json_payload = json.dumps(profile)
uri = '/api/profile/save'
connection.request('POST', uri, json_payload, headers)

print("uri " + uri)
response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
