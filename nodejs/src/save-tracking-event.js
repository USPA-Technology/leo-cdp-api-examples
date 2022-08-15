const axios = require("axios");

async function makeRequest(processData) {
  const config = {
    method: "post",
    url: "https://vnuk.leocdp.net/api/event/save",
    data: {
      targetUpdateEmail: "media@gatesfoundation.org", // the target update profile's email
      journeyMapId: "id_default_journey", // the target update journey map
      tpname: "Strand Book Store", // TOUCHPOINT_NAME
      tpurl: "https://www.strandbooks.com/", // TOUCHPOINT_URL
      tprefurl: "https://google.com", // TOUCHPOINT_REFERRER_URL
      eventdata: "{'source':'test api'}", // custom event data
      imageUrls:"https://www.insidehook.com/wp-content/uploads/2020/11/the_strand_bookstore_nyc_2020.jpg?fit=1200%2C800",
      metric: "book-store-view",
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
