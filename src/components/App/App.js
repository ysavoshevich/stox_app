import React from "react";
import { Route } from "react-router-dom";

import classes from "./App.module.css";

import News from "./News/News";
import Main from "./Main/Main";
import Charts from "./Charts/Charts";

function App() {
  return (
    <div className={classes.App}>
      <Route path="/app/news" component={News} />
      <Route path="/app/main" component={Main} />
      <Route path="/app/charts" component={Charts} />
    </div>
  );
}
export default App;
