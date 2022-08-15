const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "post",
    url: "https://vnuk.leocdp.net/api/profile/save",
    data: {
      journeyMapId: "id_default_journey",
      primaryAvatar	: "https://media.vneconomy.vn/w800/images/upload/2022/06/16/im-564446.jpg",
      primaryEmail: "media@gatesfoundation.org",
      primaryPhone: "(206) 709-3400",
      crmRefId: "123456",
      firstName: "Bill",
      middleName: "",
      lastName: "Gates",
      gender: "male",
      dateOfBirth: "1955-10-28", // yyyy-MM-dd
      dataLabels: "test; demo; fake data; CRM",
      totalCLV: 114.2,
      totalCAC: 10.1,
      totalTransactionValue: 20.25,
      jobTitles: "software developer; investor; author; philanthropist",
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
