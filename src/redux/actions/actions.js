const START = "START";

const start_WhosThatPokemon = (pokemonName) => {
  return {
    type: "START",
    payload: pokemonName,
  };
};

const complete_WhosThatPokemon = () => {
  return {
    type: "COMPLETE",
    payload: "",
  };
};

module.exports = {
  START,
  start_WhosThatPokemon,
  complete_WhosThatPokemon,
};
