import React from "react";
import classes from "./AuthMessage.module.css";

function AuthMessage(props) {
  return (
    <span className={classes.AuthMessage}>
      <span className={classes[props.type]}>{props.children}</span>
    </span>
  );
}

export default AuthMessage;
