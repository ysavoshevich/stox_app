import * as actionTypes from "../actions/actionTypes";
import { updatedObject } from "../utility";
import isEmail from "validator/lib/isEmail";
import isNumeric from "validator/lib/isNumeric";

const initialState = {
  localId: "NOT_DECIDED",
  valid: false,
  mode: "logIn",
  loading: false,
  error: null,
  message: null,
  authConfig: {
    email: {
      elementConfig: {
        type: "text",
        placeholder: ""
      },
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementConfig: {
        type: "password",
        placeholder: ""
      },
      value: "",
      validation: {
        required: true,
        minLength: 4
      },
      valid: false,
      touched: false
    },
    name: {
      elementConfig: {
        type: "name",
        placeholder: ""
      },
      value: "",
      validation: {
        required: false
      },
      valid: false,
      touched: false
    }
  }
};

const inputHandler = (state, action) => {
  const newState = { ...state };
  const newAuthConfig = { ...newState.authConfig };
  const newInputElement = { ...newAuthConfig[action.inputIdentifier] };

  newInputElement.value = action.value;
  newInputElement.valid = checkValidity(
    newInputElement.value,
    newInputElement.validation
  );

  newState.valid = checkFormValidity(state, newAuthConfig);
  newInputElement.touched = true;

  newAuthConfig[action.inputIdentifier] = newInputElement;
  newState.authConfig = newAuthConfig;
  return updatedObject(state, newState);
};

const signInSuccess = (state, action) => {
  const newState = { ...state };
  const newAuthConfig = { ...newState.authConfig };
  newState.loading = false;
  newState.error = null;
  newState.message = null;
  newState.localId = action.localId;

  // eslint-disable-next-line no-unused-vars
  for (let inputIdentifier in newAuthConfig) {
    const newInputElement = { ...newAuthConfig[action.inputIdentifier] };
    newInputElement.value = "";
    newAuthConfig[inputIdentifier] = newInputElement;
  }
  return updatedObject(state, newState);
};

const signInFail = (state, action) => {
  let error = null;

  switch (action.error) {
    case "auth/user-not-found":
      error = "Email not found!";
      break;
    case "auth/wrong-password":
      error = "Invalid password!";
      break;
    case "auth/user-disabled":
      error = "User disabled.";
      break;
    case "auth/app-deleted":
      error = "App deleted.";
      break;
    default:
      error =
        "Something Went Wrong, Sorry! Probably One Of The APIs Used In The Project Is Not Working Properly.";
  }
  return updatedObject(state, { loading: false, error, message: null });
};

const signUpSuccess = (state, action) => {
  return updatedObject(state, {
    loading: false,
    error: null
  });
};

const signUpFail = (state, action) => {
  let error = null;

  switch (action.error) {
    case "auth/email-already-in-use":
      error = "Email is taken.";
      break;
    case "auth/too-many-requests":
      error = "Too many API calls, try again in a minute.";
      break;
    case "auth/user-disabled":
      error = "User disabled.";
      break;
    case "auth/app-deleted":
      error = "App deleted from Firebase.";
      break;
    default:
      error = action.err;
  }
  return updatedObject(state, { loading: false, error, message: null });
};

const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }

  if (rules.isEmail) {
    isValid = isEmail(value) && isValid;
  }

  if (rules.isNumeric) {
    isValid = isNumeric(value) && isValid;
  }

  return isValid;
};

const checkFormValidity = (state, authConfig) => {
  if (
    authConfig["email"].valid === false ||
    authConfig["password"].valid === false
  ) {
    return false;
  } else return true;
};

const changeMode = (state, action) => {
  return updatedObject(state, { mode: action.mode });
};

const authStart = (state, action) => {
  return updatedObject(state, { loading: true });
};

const setLocalID = (state, action) => {
  return updatedObject(state, { localId: action.id });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INPUT_HANDLER:
      return inputHandler(state, action);
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.SIGN_UP_SUCCESS:
      return signUpSuccess(state, action);
    case actionTypes.SIGN_UP_FAIL:
      return signUpFail(state, action);
    case actionTypes.SIGN_IN_SUCCESS:
      return signInSuccess(state, action);
    case actionTypes.SIGN_IN_FAIL:
      return signInFail(state, action);
    case actionTypes.CHANGE_MODE:
      return changeMode(state, action);
    case actionTypes.SET_LOCALID:
      return setLocalID(state, action);
    default:
      return state;
  }
};

export default reducer;
