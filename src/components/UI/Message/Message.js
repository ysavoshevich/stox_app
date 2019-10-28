import React from "react";
import classes from "./Message.module.css";

function Message(props) {
  return (
    <span className={classes.Message}>
      <span className={classes[props.type]}>{props.children}</span>
    </span>
  );
}

export default Message;
