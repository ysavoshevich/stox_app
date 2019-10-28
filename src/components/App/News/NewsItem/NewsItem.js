import React from "react";
import classes from "./NewsItem.module.css";

function newsItem(props) {
  return (
    <div
      className={
        props.index === props.arrayLength - 1
          ? [classes.NewsItem, classes.BorderBottom].join(" ")
          : classes.NewsItem
      }>
      <img alt="Article IMG" src={props.imgSrc} />
      <div className={classes.Title}>
        <a href={props.url} target="_blank" rel="noopener noreferrer">
          {props.title}
        </a>
      </div>
    </div>
  );
}

export default newsItem;
