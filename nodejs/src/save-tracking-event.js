const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "post",
    url: "https://demo.leocdp.net/api/event/save",
    data: {
      targetUpdateEmail: "ndielhenn123@jugem.jp", // the target update profile's email
      journeyMapId: "id_default_journey", // the target update journey map
      tpname: "Vietnam's Home for Real Estate", // TOUCHPOINT_NAME
      tpurl: "https://www.fazwaz.vn/", // TOUCHPOINT_URL
      tprefurl: "https://google.com", // TOUCHPOINT_REFERRER_URL
      eventdata: "{'source':'test api'}", // custom event data
      imageUrls:"https://cdn.fazwaz.com/wbr/NNL0DlPIBz2QH9Qfx6CPMmGQZI4/263x333/region/120/hcm.jpg",
      metric: "page-view",
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
