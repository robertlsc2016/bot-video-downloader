const initialState = {
  valid_pokemon: "",
  // EMPTY, STARTED,
  tip: "",
  status: "EMPTY",
};

function pokemonReducer(state = initialState, action) {
  switch (action.type) {
    case "START":
      return {
        valid_pokemon: action.payload,
        tip: action.tip,
        status: "STARTED",
      };

    case "TIP": {
      return {
        ...state,
        tip: action.tip,
      };
    }

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
