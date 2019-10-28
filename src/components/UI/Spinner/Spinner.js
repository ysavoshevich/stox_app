import React from "react";
import classes from "./Spinner.module.css";

function Spinner(props) {
  let style = null;
  if (props.type === "News") {
    style = {
      position: "static"
    };
  }

  return (
    <div className={classes.Wrapper} style={style}>
      <div className={classes.Loader}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Spinner;
