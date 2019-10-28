import React, { Component } from "react";
import classes from "./GeneralInfo.module.css";
import Spinner2 from "../../UI/Spinner2/Spinner2";

class GeneralInfo extends Component {
  render() {
    let style = null;
    this.props.finData.portfolioChangeUSD > 0
      ? (style = classes.Success)
      : (style = classes.Danger);
    return (
      <div className={classes.GeneralInfo}>
        <h1>Your Portfolio: </h1>
        <div className={classes.Stats}>
          <p>
            Money Available:
            <span>
              {" "}
              {this.props.finData.moneyAvailable
                ? this.props.finData.moneyAvailable.toFixed(2)
                : null}
            </span>
          </p>
          <p>
            Change, USD:{" "}
            <span className={style}>
              {this.props.finData.portfolioChangeUSD}
            </span>
          </p>
          <p>
            Change, %:{" "}
            <span className={style}>
              {this.props.finData.portfolioChangePercentage}
            </span>
          </p>
          {this.props.finData.loading === true ? <Spinner2 /> : null}
        </div>
      </div>
    );
  }
}

export default GeneralInfo;
