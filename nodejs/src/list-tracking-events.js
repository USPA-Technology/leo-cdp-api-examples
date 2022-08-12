const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "get",
    url: "https://demo.leocdp.net/api/event/list",
    params: {
      profileId: "21KAhqymDWBpDIoD5XeAfQ",
      startIndex: 0,
      numberResult: 3,
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
