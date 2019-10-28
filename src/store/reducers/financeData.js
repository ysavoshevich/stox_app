import * as actionTypes from "../actions/actionTypes";
import { updatedObject } from "../utility";

const initialState = {
  bestMatches: null,
  searchInputValue: "",
  securitiesOwned: null,
  securitiesWatch: null,
  moneyAvailable: null,
  lastRelativePoint: null,
  portfolioChangeUSD: null,
  portfolioChangePercentage: null,
  portfolioChartData: [],
  message: null,
  loading: false
};

const toggleBuyingMode = (state, action) => {
  const newBestMatches = { ...state.bestMatches };
  const symbol = action.symbol;
  newBestMatches[symbol] = { ...state.bestMatches[action.symbol] };
  newBestMatches[symbol].buying = !newBestMatches[symbol].buying;
  if (action.input) {
    newBestMatches[symbol].inputValue = action.input;
  }

  return updatedObject(state, { bestMatches: newBestMatches });
};

const saveBuyingInputValue = (state, action) => {
  const newBestMatches = { ...state.bestMatches };
  const symbol = action.symbol;
  newBestMatches[symbol] = { ...state.bestMatches[action.symbol] };
  newBestMatches[symbol].inputValue = action.input;
  return updatedObject(state, { bestMatches: newBestMatches });
};

const handleResponses = (state, action) => {
  if (action.message) {
    return updatedObject(state, {
      message: { message: action.message, messageType: action.messageType }
    });
  } else {
    return updatedObject(state, {
      message: {
        message:
          "Something Went Wrong, Sorry! Probably One Of The APIs Used In The Project Is Not Working Properly.",
        messageType: "Danger"
      }
    });
  }
};
const closeMessage = (state, action) => {
  return updatedObject(state, { message: null });
};

const updatePortfolioStats = (state, action) => {
  return updatedObject(state, {
    portfolioChangeUSD: calculatePortfolioChangeUSD(state, action),
    portfolioChangePercentage: calculatePortfolioChangePercentage(state, action)
  });
};

const calculatePortfolioChangeUSD = (state, action) => {
  const newSecurititesOwned = [...state.securitiesOwned];
  const newPortfolioChangeUSD = newSecurititesOwned.reduce((acc, security) => {
    return acc + security.changeUSD;
  }, 0);

  return parseFloat(newPortfolioChangeUSD.toFixed(2));
};

const calculatePortfolioChangePercentage = (state, action) => {
  return parseFloat(
    (
      (calculatePortfolioChangeUSD(state, action) / state.lastRelativePoint) *
      100
    ).toFixed(2)
  );
};

const loadBestMatchesSuccess = (state, action) => {
  const list = {};
  action.bestMatches.map(
    bestMatch =>
      (list[bestMatch["1. symbol"]] = {
        symbol: bestMatch["1. symbol"],
        name: bestMatch["2. name"],
        buying: false,
        inputValue: "",
        error: false
      })
  );
  return updatedObject(state, { bestMatches: list });
};

const saveSearchInputValue = (state, action) => {
  return updatedObject(state, {
    searchInputValue: action.searchInputValue
  });
};

const clearSearchInputValue = (state, action) => {
  return updatedObject(state, { searchInputValue: "", bestMatches: null });
};

const handleUpdate = (state, action) => {
  return updatedObject(state, {
    securitiesOwned: action.dataFromServer.securitiesOwned,
    moneyAvailable: action.dataFromServer.moneyAvailable,
    lastRelativePoint: action.dataFromServer.lastRelativePoint,
    portfolioChartData: action.dataFromServer.portfolioChartData
  });
};

const finDataLoadingTrue = (state, action) => {
  return updatedObject(state, { loading: true });
};

const finDataLoadingFalse = (state, action) => {
  return updatedObject(state, {
    loading: false,
    bestMatches: null
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_BESTMATCHES_SUCCESS: {
      return loadBestMatchesSuccess(state, action);
    }
    case actionTypes.SAVE_SEARCH_INPUT_VALUE: {
      return saveSearchInputValue(state, action);
    }
    case actionTypes.CLEAR_SEARCH_INPUT_VALUE: {
      return clearSearchInputValue(state, action);
    }
    case actionTypes.SAVE_AMOUNT_INPUT_VALUE: {
      return saveBuyingInputValue(state, action);
    }
    case actionTypes.TOGGLE_AMOUNT_INPUT_MODE: {
      return toggleBuyingMode(state, action);
    }
    case actionTypes.HANDLE_RESPONSES: {
      return handleResponses(state, action);
    }
    case actionTypes.HANDLE_UPDATE: {
      return handleUpdate(state, action);
    }
    case actionTypes.CLOSE_MESSAGE: {
      return closeMessage(state, action);
    }
    case actionTypes.UPDATE_PORTFOLIO_STATS: {
      return updatePortfolioStats(state, action);
    }
    case actionTypes.FINDATA_LOADING_TRUE: {
      return finDataLoadingTrue(state, action);
    }
    case actionTypes.FINDATA_LOADING_FALSE: {
      return finDataLoadingFalse(state, action);
    }
    default:
      return state;
  }
};

export default reducer;
