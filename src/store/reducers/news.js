import * as actionTypes from "../actions/actionTypes";
import { updatedObject } from "../utility";

const initialState = {
  articles: [],
  currentPage: 1,
  loading: false
};

const setNextPage = (state, action) => {
  if (state.currentPage !== action.pages) {
    return updatedObject(state, { currentPage: state.currentPage + 1 });
  } else return state;
};

const setPreviousPage = (state, action) => {
  if (state.currentPage !== 1) {
    return updatedObject(state, { currentPage: state.currentPage - 1 });
  } else return state;
};

const loadNewsStart = (state, action) => {
  return updatedObject(state, { loading: true });
};

const loadNewsSuccess = (state, action) => {
  return updatedObject(state, {
    articles: action.articles,
    loading: false
  });
};

const loadNewsFail = (state, action) => {
  return updatedObject(state, { articles: null, loading: false });
};

const setCurrentPage = (state, action) => {
  return updatedObject(state, { currentPage: action.num });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_NEWS_START:
      return loadNewsStart(state, action);
    case actionTypes.LOAD_NEWS_SUCCESS:
      return loadNewsSuccess(state, action);
    case actionTypes.LOAD_NEWS_FAIL:
      return loadNewsFail(state, action);
    case actionTypes.SET_CURRENT_PAGE:
      return setCurrentPage(state, action);
    case actionTypes.SET_NEXT_PAGE:
      return setNextPage(state, action);
    case actionTypes.SET_PREVIOUS_PAGE:
      return setPreviousPage(state, action);
    default:
      return state;
  }
};

export default reducer;
