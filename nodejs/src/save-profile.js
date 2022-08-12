const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "post",
    url: "https://demo.leocdp.net/api/profile/save",
    data: {
      primaryEmail: "ndielhenn123@jugem.jp",
      primaryPhone: "090312298",
      crmRefId: "123456",
      firstName: "Marco",
      middleName: "van",
      lastName: "Basten",
      gender: "male",
      dateOfBirth: "1964-10-31", // yyyy-MM-dd
      dataLabels: "test; demo; fake data; CRM",
      totalCLV: 101.1,
      totalCAC: 10.1,
      totalTransactionValue: 120.2,

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
