const initialState = {
  valid_pokemon: "",
  // EMPTY, STARTED, COMPLETE
  status: "EMPTY",
};

function pokemonReducer(state = initialState, action) {
  switch (action.type) {
    case "START":
      return {
        valid_pokemon: action.payload,
        status: "STARTED",
      };

    case "COMPLETE":
      return {
        valid_pokemon: "",
        status: "COMPLETE",
      };

    default:
      return state;
  }
}

module.exports = pokemonReducer;
