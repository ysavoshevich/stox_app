import React from "react";
import classes from "./Logo.module.css";

function Logo(props) {
  let classNames = null;
  if (props.type === "Auth") {
    classNames = [classes.LogoAuth, classes.Logo].join(" ");
  } else {
    classNames = [classes.LogoNav, classes.Logo].join(" ");
  }
  return <h2 className={classNames}>StoX</h2>;
}

export default Logo;
