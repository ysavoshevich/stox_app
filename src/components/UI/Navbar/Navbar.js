import React, { useState, Fragment, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import classes from "./Navbar.module.css";

function Navbar(props) {
  const [state, toggle] = useState(false);
  const propsSpring = useSpring({
    transform: state ? "translateY(0px)" : "translateY(-200px)",

    config: { duration: 250 }
  });
  useEffect(() => {
    toggle(false);
  }, []);
  const widescreenContents = (
    <Fragment>
      <h3>
        <Link
          to="/app/main"
          style={{
            color: "white",
            background: "none",
            padding: "0",
            height: "initial"
          }}
          onClick={() => toggle(!state)}>
          <Logo type={"Nav"} />
        </Link>
      </h3>
      <div className={classes.WidescreenNav}>
        <NavLink
          exact
          to="/app/news"
          activeStyle={{ color: "orange" }}
          onClick={() => toggle(!state)}>
          NEWS
        </NavLink>
        <Button action={props.onLogout} color={"orange"}>
          Logout
        </Button>
      </div>
    </Fragment>
  );

  const mobileContents = (
    <Fragment>
      <h3>
        <Link
          to="/app/main"
          style={{
            color: "white",
            background: "none",
            padding: "0",
            height: "initial"
          }}
          onClick={() => toggle(!state)}>
          StoX
        </Link>
      </h3>
      <i className="fas fa-bars fa-2x" onClick={() => toggle(!state)}></i>
    </Fragment>
  );

  const mobileNav = (
    <ul className={classes.MobileNav}>
      <li>
        <NavLink
          exact
          to="/app/main"
          activeStyle={{ color: "orange" }}
          onClick={() => toggle(!state)}>
          MAIN
        </NavLink>
      </li>
      <li>
        <NavLink
          exact
          to="/app/news"
          activeStyle={{ color: "orange" }}
          onClick={() => toggle(!state)}>
          NEWS
        </NavLink>
      </li>
      <li>
        <NavLink
          exact
          to="/app/charts"
          activeStyle={{ color: "orange" }}
          onClick={() => toggle(!state)}>
          CHARTS
        </NavLink>
      </li>
      <li>
        <NavLink to="/" onClick={props.onLogout}>
          LOGOUT
        </NavLink>
      </li>
    </ul>
  );
  return (
    <div className={classes.Wrapper}>
      <div className={classes.Navbar}>
        <div className={classes.WidescreenView}>{widescreenContents}</div>
        <div className={classes.MobileView}>{mobileContents}</div>
      </div>
      <animated.div style={propsSpring}>{mobileNav}</animated.div>
    </div>
  );
}

export default Navbar;
