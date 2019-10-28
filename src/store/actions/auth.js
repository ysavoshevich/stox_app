import * as actionTypes from "./actionTypes";
import firebase from "../../config/fbConfig";

export const signUpStart = authConfig => {
  return dispatch => {
    dispatch({ type: actionTypes.AUTH_START });

    const firestore = firebase.firestore();
    const auth = firebase.auth();

    auth
      .createUserWithEmailAndPassword(
        authConfig.email.value,
        authConfig.password.value
      )
      .then(res => {
        const ref = firestore.collection("users").doc(res.user.uid);
        ref.set({
          name: authConfig.name.value
        });

        dispatch(signUpSuccess(res.user.uid));
      })
      .catch(error => {
        dispatch(signUpFail(error.code));
      });
  };
};

export const signInStart = authConfig => {
  return dispatch => {
    dispatch({ type: actionTypes.AUTH_START });
    const auth = firebase.auth();
    auth
      .signInWithEmailAndPassword(
        authConfig.email.value,
        authConfig.password.value
      )
      .then(res => {
        dispatch(signInSuccess(res.user.uid));
      })
      .catch(error => {
        dispatch(signInFail(error.code));
      });
  };
};

const signUpSuccess = res => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS
  };
};

const signUpFail = error => {
  return {
    type: actionTypes.SIGN_UP_FAIL,
    error
  };
};

const signInSuccess = () => {
  return {
    type: actionTypes.SIGN_IN_SUCCESS
  };
};

const signInFail = error => {
  return {
    type: actionTypes.SIGN_IN_FAIL,
    error
  };
};

export const logout = () => {
  firebase.auth().signOut();
  return { type: actionTypes.LOGOUT };
};

export const changeMode = mode => {
  return {
    type: actionTypes.CHANGE_MODE,
    mode
  };
};

export const inputHandler = (event, mode, inputIdentifier) => {
  return {
    type: actionTypes.INPUT_HANDLER,
    value: event.target.value,
    inputIdentifier: inputIdentifier,
    mode
  };
};
