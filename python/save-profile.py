import http.client
import json

connection = http.client.HTTPSConnection('leocdp.example.com')

headers = {'Content-Type': 'application/json',
           "Access-Control-Allow-Origin": "*",
           "tokenkey": "default_access_key",
           "tokenvalue": "7091411_4Z5CKFqjUxJHpIEohZIQXf"}

profile = {
    "journeyMapIds": "id_default_journey; 1N0iuKVy226Oh8yKLybUaK; ",
    "dataLabels": "DATA_FROM_LEO_API; CRM; KOL person; investors",
    "crmRefId": "123456",
    "governmentIssuedIDs": "US_123",
    "primaryAvatar": "https://cdn.britannica.com/47/188747-050-1D34E743/Bill-Gates-2011.jpg",
    "primaryEmail": "media@gatesfoundation.org",
    "secondaryEmails": "billgates@microsoft.com; bill@microsoft.com",
    "primaryPhone": "(206) 709-3400",
    "secondaryPhones": "(206) 709-3401; (206) 709-3402",
    "firstName": "Bill",
    "middleName": "Henry",
    "lastName": "Gates",
    "gender": "male",  # or female
    "dateOfBirth": "1955-10-28",  # yyyy-MM-dd
    "livingLocation": " Medina, Washington",  # the address of customer
    "livingCity": "Washington",  # the city where customer is living
    "jobTitles": "CEO; Chairman",  # the Job Title, e.g: CEO; Manager; Head of Sales
    "workingHistory": "IBM; Microsoft",
    # reachable media channels, E.g: facebook; linkedin; chat
    "mediaChannels": "website; facebook; linkedin; ",
    "personalInterests": "coding; business; investment; philanthropist",
    "contentKeywords": "history; microsoft; product manament",
    "productKeywords": "Excel; Word; Microsoft Cloud; Vaccine; technology",
    "totalCLV": 9000,  # this is example data
    "totalCAC": 999,  # this is example data
    "totalTransactionValue": 200,  # this is example data
    "saleAgencies": "Agency A; Agency B; Agency C",  # the list of sales sources
    "saleAgents": "Mr.Thomas; Ms.Van",  # the list of sales persons
    "notes": "this is a test"
}

json_payload = json.dumps(profile)
uri = '/api/profile/save'
connection.request('POST', uri, json_payload, headers)

print("uri " + uri)
response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
