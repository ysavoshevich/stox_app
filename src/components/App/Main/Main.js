import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import Search from "../Search/Search";
import GeneralInfo from "../GeneralInfo/GeneralInfo";
import Positions from "../Positions/Positions";
import Message from "../../UI/Message/Message";
import Charts from "../Charts/Charts";
import classes from "./Main.module.css";
import * as actions from "../../../store/actions/index";
import firebase from "../../../config/fbConfig";
import Navbar from "../../UI/Navbar/Navbar";

class Main extends PureComponent {
  componentDidMount() {
    if (
      this.props.auth.localId &&
      this.props.auth.localId !== "NOT_DECIDED" &&
      this.props.auth.localId !== null
    ) {
      const usersDataRef = firebase
        .firestore()
        .collection("users")
        .doc(this.props.auth.localId);
      usersDataRef.onSnapshot(this.props.handleFirebaseUpdate);
    }
  }

  componentDidUpdate() {
    if (this.props.finData.message) {
      setTimeout(() => {
        this.props.closeMessage();
      }, 3000);
    }
  }

  render() {
    return (
      <Fragment>
        <Navbar onLogout={this.props.onLogout} />
        <div className={classes.Main}>
          <div className={classes.InfoSection}>
            <div>
              <div className={classes.SearchAndMessage}>
                <Search
                  handleSearch={input =>
                    this.props.handleSearch(input.target.value)
                  }
                  clearInput={this.props.clearInput}
                  saveAmountInputValue={this.props.saveAmountInputValue}
                  toggleAmountInputMode={this.props.toggleAmountInputMode}
                  openPosition={this.props.openPosition}
                  finData={this.props.finData}
                />
                {this.props.finData.message ? (
                  <p>
                    <Message type={this.props.finData.message.messageType}>
                      {this.props.finData.message.message}
                    </Message>
                  </p>
                ) : null}
              </div>
              <GeneralInfo finData={this.props.finData} />
            </div>
            <div className={classes.Charts}>
              <Charts />
            </div>
          </div>
          <Positions
            closePosition={this.props.closePosition}
            updatePrices={() =>
              this.props.updatePrices(this.props.finData.securitiesOwned)
            }
            finData={this.props.finData}
          />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    finData: state.finData,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout()),
    handleSearch: input => dispatch(actions.handleSearch(input)),
    clearInput: () => dispatch(actions.clearInput()),
    saveAmountInputValue: (input, symbol) => {
      dispatch(actions.saveAmountInputValue(input, symbol));
    },
    toggleAmountInputMode: symbol =>
      dispatch(actions.toggleAmountInputMode(symbol)),
    openPosition: (symbol, type) =>
      dispatch(actions.openPosition(symbol, type)),
    closePosition: symbol => dispatch(actions.closePosition(symbol)),
    updatePrices: securitiesOwned =>
      dispatch(actions.updatePrices(securitiesOwned)),
    handleFirebaseUpdate: snapshot =>
      dispatch(actions.handleFirebaseUpdate(snapshot.data())),
    closeMessage: () => dispatch(actions.closeMessage())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
