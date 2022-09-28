const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "post",
    url: "https://vnuk.leocdp.net/api/profile/save",
    data: {
      journeyMapId: "id_default_journey",
      dataLabels: "DATA_FROM_LEO_API; CRM",
      crmRefId: "123456",
      primaryAvatar	: "https://media.vneconomy.vn/w800/images/upload/2022/06/16/im-564446.jpg",
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
      jobTitles: "", // the Job Title, e.g: CEO; Manager; Head of Sales
      workingHistory: "",
      mediaChannels: "", // reachable media channels, E.g: facebook; linkedin; chat
      personalInterests: "", 
      contentKeywords: "",
      productKeywords: "",
      totalCLV: 0,
      totalCAC: 0,
      totalTransactionValue: 0 ,
      saleAgencies: "", // the list of sales sources, e.g: Agency A; Agency B
      saleAgents: "" // the list of  sales persons, e.g: Mr.Thomas; Ms.Van
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
