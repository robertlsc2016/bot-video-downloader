require("dotenv").config();

const browserPath = process.env.PATH_BROWSER;
const shippingAllowed = process.env.SHIPPING_ALLLOWED;
const stringToGroup = process.env.STRING_TO_GROUP_WWEBJS

module.exports = {
  browserPath,
  shippingAllowed,
  stringToGroup
};
