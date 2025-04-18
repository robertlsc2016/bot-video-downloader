const axios = require("axios");

const getTiktokURL = async ({ url }) => {
  let host = "https://www.tikwm.com/";
  let res = await axios.post(
    host + "api/",
    {},
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      },
      params: {
        url: url,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1,
      },
    }
  );

  const video = host + res.data.data.play;
  return video;
};
module.exports = {
  getTiktokURL,
};
