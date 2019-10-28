import React from "react";
import classes from "./Pagination.module.css";
import PageNumber from "./PageNumber/PageNumber";

function Pagination(props) {
  const pageNumbers = [];
  for (let i = 1; i <= props.pages + 1; i++) {
    pageNumbers.push(
      <PageNumber
        key={i}
        number={i}
        setCurrentPage={props.setCurrentPage}
        currentPage={props.currentPage}
      />
    );
  }

  const arrows = [
    <i
      key={"1"}
      className="fas fa-backward fa-2x"
      onClick={props.setPreviousPage}></i>,
    <i
      key={"2"}
      className="fas fa-forward fa-2x"
      onClick={props.setNextPage}></i>
  ];

  return (
    <div className={classes.Pagination}>
      <div className={classes.PageNumbers}>{pageNumbers}</div>
      <div className={classes.Arrows}>{arrows}</div>
    </div>
  );
}

export default Pagination;
