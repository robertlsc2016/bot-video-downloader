const axios = require("axios");

module.exports.getGuestToken = async function () {
  console.log("entrou no getGuestToken")
  try {
    const { data } = await axios(
      "https://api.twitter.com/1.1/guest/activate.json",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        },
      }
    );

    console.log(data.guest_token);
    return data.guest_token;
  } catch(error) {
    console.log("deu erro ",error)
    return null;
  }
};
