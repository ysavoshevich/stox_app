import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";

import "./Page.css";

import firebase from "./config/fbConfig";
import * as actionTypes from "./store/actions/actionTypes";
import * as actions from "./store/actions/index";

import App from "./components/App/App";
import Auth from "./components/Auth/Auth";

class Page extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        this.props.setLocalId(firebaseUser.uid);
        this.props.loadSecurities(firebaseUser.uid);
        this.props.updatePrices();
      } else {
        this.props.setLocalId(null);
      }
    });
  }

  render() {
    let content = [];
    if (
      this.props.auth.localId !== "NOT_DECIDED" &&
      this.props.auth.localId !== null
    ) {
      content = (
        <Switch>
          <Route path="/app" component={App} />

          <Redirect to="/app/main" />
        </Switch>
      );
    }
    if (this.props.auth.localId === null) {
      content = (
        <Switch>
          <Route path="/auth" component={Auth} />
          <Redirect to="/auth" />
        </Switch>
      );
    }
    return <div className="Page">{content}</div>;
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLocalId: id => dispatch({ type: actionTypes.SET_LOCALID, id }),
    loadSecurities: id => dispatch(actions.loadSecurities(id)),
    updatePrices: id => dispatch(actions.updatePrices(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
