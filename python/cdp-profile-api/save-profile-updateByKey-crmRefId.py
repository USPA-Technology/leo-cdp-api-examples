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
sampleSocialMediaProfiles = {"zalo": "123456789", "facebook": "123456789", "linkedin": "123456789","twitter": "123456789","github": "123456789"}
sampleIncomeHistory = {"2022-2023": 2000000, "2023-2024": 3000000}

profile = {
    "journeyMapIds": "id_default_journey; ",
    "dataLabels": "CRM; KOL person; người nổi tiếng; investors; doanh nhân đầu tư; test",
    "crmRefId": "crm-1112",
    "governmentIssuedIDs": "US_123",
    "primaryAvatar": "https://vnn-imgs-a1.vgcloud.vn/icdn.dantri.com.vn/2021/05/26/ngo-ngang-voi-ve-dep-cua-hot-girl-anh-the-chua-tron-18-docx-1622043349706.jpeg",
    "primaryEmail": "bill.john123@example.com",
    "secondaryEmails": "",
    "primaryPhone":"1112345678",
    "secondaryPhones": "(206) 709-3401; (206) 709-3402",
    "firstName": "Anh",
    "middleName": "Thi Ngoc",
    "lastName": "Nguyen",
    "gender": "female",  # or female
   # "dateOfBirth": "1955-10-28",  # yyyy-MM-dd
    "age": 20,
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
    
    "extAttributes": json.dumps(sampleExtAttributes),
    "incomeHistory": json.dumps(sampleIncomeHistory),
    "socialMediaProfiles": json.dumps(sampleSocialMediaProfiles),
    "totalLoyaltyScore": 100,
    
    # custom score 
    "extMetrics": json.dumps({'Dpoint_Loyalty_Score': 120}),   
    
    "createdat": "2020-03-09T02:27:41Z",
    "updatedat": "2021-05-15T02:27:41Z",
    
    "notes": "this is a test crmRefId",
    
    # control how to save profile
    # valid value: primaryEmail, primaryPhone, crmRefId , socialMediaProfiles, applicationIDs, governmentIssuedIDs, loyaltyIDs, fintechSystemIDs
    "updateByKey":"crmRefId",
    
    # if deduplicate : True, the CDP will automatically merge duplicate profiles into one 
    "deduplicate": False
}

json_payload = json.dumps(profile)
uri = '/api/profile/save'
connection.request('POST', uri, json_payload, headers)

print("uri " + uri)
response = connection.getresponse()
result = json.dumps(response.read().decode(), indent=2)
print(result)
