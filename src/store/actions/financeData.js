import * as actionTypes from "./actionTypes";
import axios from "axios";
import firebase from "../../config/fbConfig";

export const handleSearch = input => {
  return dispatch => {
    dispatch({
      type: actionTypes.SAVE_SEARCH_INPUT_VALUE,
      searchInputValue: input
    });
    axios
      .get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=672X6GA0BGICYJLF`
      )
      .then(res => {
        if (res.data.Note) {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: "Too many API calls, sorry.",
            messageType: "Danger"
          });
        } else {
          dispatch({
            type: actionTypes.LOAD_BESTMATCHES_SUCCESS,
            bestMatches: res.data.bestMatches
          });
        }
      })
      .catch(dispatch({ type: actionTypes.LOAD_BESTMATCHES_FAIL }));
  };
};

export const clearInput = () => {
  return { type: actionTypes.CLEAR_SEARCH_INPUT_VALUE };
};

export const saveAmountInputValue = (input, symbol) => {
  return {
    type: actionTypes.SAVE_AMOUNT_INPUT_VALUE,
    input: input.target.value,
    symbol
  };
};

export const toggleAmountInputMode = symbol => {
  return { type: actionTypes.TOGGLE_AMOUNT_INPUT_MODE, symbol };
};

export const openPosition = (symbol, type) => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FINDATA_LOADING_TRUE });
    let amount = getState().finData.bestMatches[symbol].inputValue;
    if (amount === "" || amount === "0") {
      dispatch({
        type: actionTypes.HANDLE_RESPONSES,
        message: "Amount not specified.",
        messageType: "Danger"
      });
      dispatch({ type: actionTypes.FINDATA_LOADING_FALSE });
      return;
    } else {
      amount = parseInt(getState().finData.bestMatches[symbol].inputValue);
      dispatch({ type: actionTypes.CLEAR_SEARCH_INPUT_VALUE });
    }
    axios
      .post("https://us-central1-stox-75ce4.cloudfunctions.net/openPosition", {
        amount,
        localId: getState().auth.localId,
        symbol,
        type
      })
      .then(res => {
        if (res.data.type === "Danger") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Danger"
          });
        }
        if (res.data.type === "Success") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Success"
          });
        }

        dispatch({ type: actionTypes.FINDATA_LOADING_FALSE });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.HANDLE_RESPONSES,
          errorType: "UNKNOWN",
          message: err.message
        });
        dispatch({ type: actionTypes.FINDATA_LOADING_FALSE });
      });
  };
};

export const closePosition = symbol => {
  return (dispatch, getState) => {
    dispatch({ type: actionTypes.FINDATA_LOADING_TRUE });
    axios
      .post("https://us-central1-stox-75ce4.cloudfunctions.net/closePosition", {
        localId: getState().auth.localId,
        symbol
      })
      .then(res => {
        if (res.data.type === "Success") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Success"
          });
        }
        if (res.data.type === "Danger") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Danger"
          });
        }
        dispatch({ type: actionTypes.FINDATA_LOADING_FALSE });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.HANDLE_RESPONSES,
          message: err.message,
          messageType: "Danger"
        });
        dispatch({ type: actionTypes.FINDATA_LOADING_FALSE });
      });
  };
};

export const updatePrices = id => {
  return (dispatch, getState) => {
    let userID = null;
    if (getState().auth.localId) {
      userID = getState().auth.localId;
    } else if (id) {
      userID = id;
    } else {
      return;
    }
    dispatch({ type: actionTypes.FINDATA_LOADING_TRUE });
    axios
      .post("https://us-central1-stox-75ce4.cloudfunctions.net/updatePrices", {
        localId: userID
      })
      .then(res => {
        if (res.data.type === "Success") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Success"
          });
        }
        if (res.data.type === "Danger") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Danger"
          });
        }
        dispatch({ type: actionTypes.FINDATA_LOADING_FALSE });
        dispatch({ type: actionTypes.UPDATE_PORTFOLIO_STATS });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.HANDLE_RESPONSES,
          message: err.message,
          messageType: "Danger"
        });
        dispatch({ type: actionTypes.FINDATA_LOADING_FALSE });
      });
  };
};

export const handleFirebaseUpdate = dataFromServer => {
  return dispatch => {
    dispatch({ type: actionTypes.HANDLE_UPDATE, dataFromServer });
  };
};

export const loadSecurities = id => {
  return dispatch => {
    const firestore = firebase.firestore();
    const usersDataRef = firestore.collection("users").doc(id);

    usersDataRef
      .get()
      .then(res => {
        dispatch({
          type: actionTypes.HANDLE_UPDATE,
          dataFromServer: res.data()
        });
        if (res.data.type === "Success") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Success"
          });
        }
        if (res.data.type === "Danger") {
          dispatch({
            type: actionTypes.HANDLE_RESPONSES,
            message: res.data.message,
            messageType: "Danger"
          });
        }
      })
      .catch(err =>
        dispatch({
          type: actionTypes.HANDLE_RESPONSES,
          message: err.message,
          messageType: "Danger"
        })
      );
  };
};

export const closeMessage = () => {
  return { type: actionTypes.CLOSE_MESSAGE };
};
