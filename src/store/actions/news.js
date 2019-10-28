import axios from "axios";
import * as actionTypes from "./actionTypes";

export const getNews = () => {
  return dispatch => {
    dispatch({ type: actionTypes.LOAD_NEWS_START });
    axios
      .get(
        "https://newsapi.org/v2/top-headlines?country=us&pageSize=100&category=business&apiKey=9f3c9b19f145452dac137e9e4a2d3ce0"
      )
      .then(res => {
        dispatch({
          type: actionTypes.LOAD_NEWS_SUCCESS,
          articles: res.data.articles
        });
      })
      .catch(err =>
        dispatch({
          type: actionTypes.LOAD_NEWS_FAIL
        })
      );
  };
};

export const setCurrentPage = num => {
  return {
    type: actionTypes.SET_CURRENT_PAGE,
    num: num
  };
};

export const setNextPage = pages => {
  return {
    type: actionTypes.SET_NEXT_PAGE,
    pages
  };
};

export const setPreviousPage = pages => {
  return {
    type: actionTypes.SET_PREVIOUS_PAGE,
    pages
  };
};
