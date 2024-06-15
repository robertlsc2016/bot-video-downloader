require("dotenv").config();

const browserPath = process.env.PATH_BROWSER;
const shippingAllowed = process.env.SHIPPING_ALLLOWED;
const twitter_authorization = process.env.TWTITER_AUTHORIZATION;

module.exports = {
  browserPath,
  shippingAllowed,
  twitter_authorization,
};
