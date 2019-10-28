import React from "react";
import classes from "./InputElement.module.css";

function InputElement(props) {
  let icon = null;
  switch (props.type) {
    case "email":
      icon = <i className="fas fa-envelope"></i>;
      break;
    case "password":
      icon = <i className="fas fa-key"></i>;
      break;
    case "name":
      icon = <i className="fas fa-user-alt"></i>;
      break;
    case "language":
      icon = <i className="fas fa-globe"></i>;
      break;
    default:
      icon = null;
  }

  return (
    <div className={classes.InputElement}>
      <label>
        {props.type}
        {props.valid === false && props.touched === true ? (
          props.type === "email" ? (
            <span className={classes.Danger}>- Enter a valid email</span>
          ) : (
            <span className={classes.Danger}>- Should be >3 characters</span>
          )
        ) : null}
      </label>

      <div className={classes.Input}>
        {icon}
        <input
          {...props.config}
          onChange={props.onHandleInput}
          className={
            props.valid === false && props.touched === true
              ? classes.Invalid
              : classes.Valid
          }
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}

export default InputElement;
