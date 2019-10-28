import React from "react";
import classes from "./Button.module.css";

function Button(props) {
  let style = [classes.Button];
  if (props.color === "orange") {
    style.push(classes.Orange);
  } else {
    style.push(classes.Regular);
  }
  return (
    <button
      type={props.type}
      disabled={props.disabled}
      className={style.join(" ")}
      onClick={props.action}>
      {props.children}
    </button>
  );
}

export default Button;
