import React from "react";
import { connect } from "react-redux";

import classes from "./Form.module.css";
import * as actions from "../../../store/actions/index";

import InputElement from "./InputElement/InputElement";
import Button from "../../UI/Button/Button";
import Spinner from "../../UI/Spinner/Spinner";
import Logo from "../../UI/Logo/Logo";
import AuthMessage from "../../UI/AuthMessage/AuthMessage";

function Form(props) {
  const config = props.auth.authConfig;
  const handleSubmit = (e, mode) => {
    e.preventDefault();
    mode === "logIn" ? props.signIn(config) : props.signUp(config);
  };

  let inputs = [];
  let logInTogglerClasses = null;
  let signUpTogglerClasses = null;
  let authButtonContent = null;
  let spinner = null;
  let error = null;
  let message = null;

  props.auth.loading === true
    ? (spinner = <Spinner type="Auth" />)
    : (spinner = null);
  props.auth.error
    ? (error = <AuthMessage type="Danger"> {props.auth.error}</AuthMessage>)
    : (error = null);
  props.auth.message
    ? (message = <AuthMessage type="Success">{props.auth.message}</AuthMessage>)
    : (message = null);

  // eslint-disable-next-line no-unused-vars
  for (let inputIdentifier in config) {
    if (props.auth.mode === "logIn" && inputIdentifier === "name") {
      continue;
    }
    inputs.push(
      <InputElement
        key={inputIdentifier}
        valid={config[inputIdentifier].valid}
        touched={config[inputIdentifier].touched}
        type={inputIdentifier}
        config={config[inputIdentifier].elementConfig}
        onHandleInput={event =>
          props.handleInput(event, props.auth.mode, inputIdentifier)
        }
      />
    );
  }

  if (props.auth.mode === "logIn") {
    logInTogglerClasses = [classes.Active, classes.Btn].join(" ");
    signUpTogglerClasses = [classes.Inactive, classes.Btn].join(" ");
    authButtonContent = "Log In";
  } else {
    logInTogglerClasses = [classes.Inactive, classes.Btn].join(" ");
    signUpTogglerClasses = [classes.Active, classes.Btn].join(" ");
    authButtonContent = "Sign Up";
  }

  return (
    <div className={classes.Height_small}>
      <form
        className={classes.Form}
        onSubmit={event => handleSubmit(event, props.auth.mode)}>
        <Logo type={"Auth"} />

        {spinner}
        {message}
        {error}

        <button
          className={logInTogglerClasses}
          type={"button"}
          onClick={() => props.changeMode("logIn")}>
          Log In
        </button>
        <button
          className={signUpTogglerClasses}
          type={"button"}
          onClick={() => props.changeMode("signUp")}>
          Sign Up
        </button>

        <div className={classes.Inputs}>{inputs}</div>

        <div className={classes.Center}>
          <Button disabled={!props.auth.valid} type={"submit"}>
            {authButtonContent}
          </Button>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleInput: (event, mode, inputIdentifier) =>
      dispatch(actions.inputHandler(event, mode, inputIdentifier)),
    signUp: authConfig => dispatch(actions.signUpStart(authConfig)),
    signIn: authConfig => dispatch(actions.signInStart(authConfig)),
    changeMode: mode => dispatch(actions.changeMode(mode))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
