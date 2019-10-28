import React from "react";
import Button from "../../../UI/Button/Button";
import classes from "./Dropdown.module.css";

const dropdown = props => {
  let list = [];
  let content = null;
  // eslint-disable-next-line no-unused-vars
  for (let item in props.finData.bestMatches) {
    const currentMatch = props.finData.bestMatches[item];
    const symbol = currentMatch["symbol"];
    const value = currentMatch.inputValue;
    const buyingState = currentMatch.buying;
    const name = currentMatch["name"];

    if (buyingState === false) {
      content = (
        <i
          className="fas fa-plus-circle fa-lg "
          onClick={() => props.toggleAmountInputMode(symbol)}
        />
      );
    } else {
      content = (
        <div className={classes.Input}>
          <input
            onChange={event => props.saveAmountInputValue(event, symbol)}
            value={value}
            type="number"
            placeholder="Amount..."
          />
          <Button action={() => props.openPosition(symbol, "buy")}>Buy</Button>
          <Button
            color="orange"
            action={() => props.openPosition(symbol, "short")}>
            Short
          </Button>
          <i
            className="fas fa-window-close"
            onClick={() => props.toggleAmountInputMode(symbol)}
          />
        </div>
      );
    }

    list.push(
      <li key={symbol}>
        <p>{symbol}</p>
        {content}
        <p>{name}</p>
      </li>
    );
  }

  return (
    <div className={classes.Dropdown}>
      <ul>{list}</ul>
    </div>
  );
};

export default dropdown;
