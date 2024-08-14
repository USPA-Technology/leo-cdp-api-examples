const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "post",
    url: "https://demo.leocdp.net/api/event/save",
    data: {
      targetUpdateEmail: "media@gatesfoundation.org", // the target update profile's email
      tpname: "TP bank", // TOUCHPOINT_NAME
      tpurl: "https://tpb.vn", // TOUCHPOINT_URL
      tprefurl: "https://google.com", // TOUCHPOINT_REFERRER_URL
      eventdata: {'source':'test api'}, // custom event data
      imageUrls:"https://onlinebank.com.vn/wp-content/uploads/2019/10/tpbank.jpg",
      metric: "apply-loan",
    },
    headers: {
      tokenkey: "",
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
