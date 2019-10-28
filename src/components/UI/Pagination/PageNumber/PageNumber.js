import React from "react";
import classes from "./PageNumber.module.css";

function PageNumber(props) {
  return (
    <div
      className={
        props.currentPage === props.number
          ? [classes.PageNumber, classes.CurrentPage].join(" ")
          : classes.PageNumber
      }
      onClick={() => props.setCurrentPage(props.number)}>
      {props.number}
    </div>
  );
}

export default PageNumber;
