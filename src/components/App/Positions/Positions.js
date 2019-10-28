import React, { Component } from "react";

import SecurityCard from "./SecurityCard/SecurityCard";

import "simplebar/src/simplebar.css";
import classes from "./Positions.module.css";

class Positions extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.finData.securitiesOwned &&
      this.props.finData.securitiesOwned.length > 0 &&
      prevProps.finData.securitiesOwned
    ) {
      if (
        this.props.finData.securitiesOwned.length !==
        prevProps.finData.securitiesOwned.length
      ) {
        this.props.updatePrices();
      }
    }
  }

  render() {
    let securityCards = null;
    if (this.props.finData.securitiesOwned) {
      securityCards = this.props.finData.securitiesOwned.map(security => {
        return (
          <SecurityCard
            {...security}
            key={security.symbol + Math.random()}
            closePosition={this.props.closePosition}
          />
        );
      });
    }
    return <div className={classes.Securities}>{securityCards}</div>;
  }
}

export default Positions;
