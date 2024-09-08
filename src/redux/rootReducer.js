const { combineReducers } = require("redux");
const pokemonReducer = require("./reducers/reducer");

const rootReducer = combineReducers({
  pokemon: pokemonReducer,
  // Adicione outros reducers aqui
});

module.exports = rootReducer;
