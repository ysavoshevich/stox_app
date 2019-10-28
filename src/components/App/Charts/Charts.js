import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import classes from "./Charts.module.css";
import Chart from "react-apexcharts";
import Navbar from "../../UI/Navbar/Navbar";
import moment from "moment";

function Charts(props) {
  const [chartSettings] = useState({
    options1: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: []
      }
    },
    options2: {
      chart: {
        id: "basic-bar"
      }
    }
  });
  let valueChart = null;
  let valueByTypeChart = null;
  let seriesValue = [];
  let seriesValueByType = [];
  if (
    props.finData.portfolioChartData &&
    props.finData.portfolioChartData.value
  ) {
    const chartData = props.finData.portfolioChartData.value.map(item => {
      return {
        x: moment.unix(item.x).format("MMM DD, h:mm"),
        y: item.y
      };
    });
    seriesValue.push({
      name: "Portfolio Value",
      data: chartData
    });

    valueChart = (
      <Chart
        options={chartSettings.options1}
        series={seriesValue}
        type="line"
        width="100%"
        height="90%"
      />
    );
  }

  if (
    props.finData.portfolioChartData &&
    props.finData.portfolioChartData.buyValue
  ) {
    const chartData = props.finData.portfolioChartData.buyValue.map(item => {
      return {
        x: moment.unix(item.x).format("MMM DD, h:mm"),
        y: item.y
      };
    });
    seriesValueByType.push({
      name: "Buy Positions Value",
      data: chartData
    });

    valueByTypeChart = (
      <Chart
        options={chartSettings.options2}
        series={seriesValueByType}
        type="line"
        width="100%"
        height="90%"
      />
    );
  }

  if (
    props.finData.portfolioChartData &&
    props.finData.portfolioChartData.shortValue
  ) {
    const chartData = props.finData.portfolioChartData.shortValue.map(item => {
      return {
        x: moment(item.x).format("MMM DDD, h:mm"),
        y: item.y
      };
    });
    seriesValueByType.push({
      name: "Short Positions Value",
      data: chartData
    });

    valueByTypeChart = (
      <Chart
        options={chartSettings.options2}
        series={seriesValueByType}
        type="line"
        width="100%"
        height="90%"
      />
    );
  }

  return (
    <Fragment>
      <div className={classes.Navbar}>
        <Navbar onLogout={props.onLogout} />
      </div>
      <div className={classes.Charts}>
        <div>
          <h2>Portfolio Perfomance</h2>
          {valueChart}
        </div>
        <div>
          <h2>Perfomance by Position Type</h2>
          {valueByTypeChart}
        </div>
      </div>
    </Fragment>
  );
}

const mapStateToProps = state => {
  return {
    finData: state.finData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Charts);
