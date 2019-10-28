import React, { Component } from "react";
import Dropdown from "./Dropdown/Dropdown";
import classes from "./Search.module.css";

class Search extends Component {
  state = {
    focus: false,
    bestMatches: null
  };

  toggleFocus = () => {
    this.setState(prevState => ({ focus: !prevState.focus }));
  };

  render() {
    let divStyle = null;
    let iconStyle = null;
    if (this.state.focus === true) {
      divStyle = [classes.Search, classes.FocusBorder].join(" ");
      iconStyle = classes.IconColorActive;
    } else {
      divStyle = classes.Search;
      iconStyle = classes.IconColor;
    }
    return (
      <div className={divStyle}>
        <i className={["fas fa-search", iconStyle].join(" ")}></i>
        <input
          onChange={event => this.props.handleSearch(event)}
          value={this.props.finData.searchInputValue}
          onFocus={this.toggleFocus}
          onBlur={this.toggleFocus}
          type="text"
          placeholder={"Search By Symbol..."}
        />
        <i
          className={["fas fa-window-close  fa-lg", iconStyle].join(" ")}
          onClick={this.props.clearInput}
        />

        {this.props.finData.bestMatches &&
        this.props.finData.bestMatches.length !== 0 ? (
          <Dropdown
            finData={this.props.finData}
            toggleAmountInputMode={this.props.toggleAmountInputMode}
            saveAmountInputValue={this.props.saveAmountInputValue}
            openPosition={this.props.openPosition}
          />
        ) : null}
      </div>
    );
  }
}

export default Search;
