import React from "react";
import classes from "./SecurityCard.module.css";
import Button from "../../../UI/Button/Button";

function SecurityCard(props) {
  let style = null;
  props.changeUSD > 0 ? (style = classes.Success) : (style = classes.Danger);
  return (
    <div className={classes.SecurityCard}>
      <h3>{props.symbol}</h3>
      <p>Type: {props.type}</p>
      <p>Opened At: {props.openedAt}</p>
      <p>Current Price: {props.currentPrice}</p>
      <p>
        Change, USD: <span className={style}>{props.changeUSD}</span>
      </p>
      <p>
        Change, %: <span className={style}>{props.changePercentage}</span>
      </p>
      <div className={classes.Center}>
        <Button
          action={() => props.closePosition(props.symbol)}
          color={"orange"}>
          Close Position
        </Button>
      </div>
    </div>
  );
}

export default SecurityCard;
