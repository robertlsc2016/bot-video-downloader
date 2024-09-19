const { createStore } = require("redux");
const rootReducer = require("./rootReducer");

const store = createStore(rootReducer);

module.exports = store;
