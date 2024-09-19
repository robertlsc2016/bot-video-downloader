const START = "START";

const start_WhosThatPokemon = ({ pokemonName, pokemonTip }) => {
  return {
    type: "START",
    tip: pokemonTip,
    payload: pokemonName,
  };
};

const tip_WhosThatPokemon = ({tip}) => {
  return {
    type: "TIP",
    tip: tip,
  };
};

const complete_WhosThatPokemon = () => {
  return {
    type: "COMPLETE",
    payload: "",
  };
};

module.exports = {
  tip_WhosThatPokemon,
  start_WhosThatPokemon,
  complete_WhosThatPokemon,
};
