const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "post",
    url: "https://vnuk.leocdp.net/api/profile/save",
    data: {
      journeyMapId: "id_default_journey",
      dataLabels: "DATA_FROM_LEO_API; CRM; KOL person",
      crmRefId: "123456",
      primaryAvatar	: "https://cdn.britannica.com/47/188747-050-1D34E743/Bill-Gates-2011.jpg",
      primaryEmail: "media@gatesfoundation.org",
      secondaryEmails: "",
      primaryPhone: "(206) 709-3400",
      secondaryPhones: "",
      firstName: "Bill",
      middleName: "",
      lastName: "Gates",
      gender: "male", // or female
      dateOfBirth: "1955-10-28", // yyyy-MM-dd
      livingLocation: "", // the address of customer 
      livingCity: "", // the city where customer is living
      jobTitles: "CEO; Chairman", // the Job Title, e.g: CEO; Manager; Head of Sales
      workingHistory: "IBM; Microsoft",
      mediaChannels: "website; facebook; linkedin;", // reachable media channels, E.g: facebook; linkedin; chat
      personalInterests: "coding; business; investment; philanthropist", 
      contentKeywords: "history; microsoft; product manament",
      productKeywords: "Excel; Word; Microsoft Cloud",
      totalCLV: 1000, // this is example data
      totalCAC: 99, // this is example data
      totalTransactionValue: 200 , // this is example data
      saleAgencies: "Agency A; Agency B; Agency C", // the list of sales sources
      saleAgents: "Mr.Thomas; Ms.Van" // the list of sales persons
    },
    headers: {
      tokenkey: "default_access_key",
      tokenvalue: "",
    },
  };

  let res = await axios(config);
  let data = res.data;
  if (typeof processData === "function") {
    processData(data);
  }
}

makeRequest(function (obj) {
  console.log(obj);
});
