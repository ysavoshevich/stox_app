import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import classes from "./News.module.css";
import * as actions from "../../../store/actions/index";

import NewsItem from "./NewsItem/NewsItem";
import Pagination from "../../UI/Pagination/Pagination";
import Spinner from "../../UI/Spinner/Spinner";
import Navbar from "../../UI/Navbar/Navbar";

class News extends Component {
  componentDidMount() {
    this.props.loadNews();
  }

  render() {
    let postsPerPage = 5;
    const pages = Math.ceil(this.props.articles.length / postsPerPage);
    const indexOfLast = this.props.currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    let articles = null;
    let pagination = null;

    if (this.props.loading === true) {
      articles = <Spinner type="News" />;
    } else {
      articles = this.props.articles
        .slice(indexOfFirst, indexOfLast)
        .map((article, index, array) => (
          <NewsItem
            key={article.title}
            title={article.title}
            imgSrc={article.urlToImage}
            url={article.url}
            index={index}
            arrayLength={array.length}
          />
        ));

      pagination = (
        <Pagination
          setCurrentPage={this.props.setCurrentPage}
          pages={pages}
          currentPage={this.props.currentPage}
          setNextPage={() => this.props.setNextPage(pages)}
          setPreviousPage={() => this.props.setPreviousPage(pages)}
        />
      );
    }

    return (
      <Fragment>
        <Navbar onLogout={this.props.onLogout} />
        <div className={classes.News}>
          {articles}
          {pagination}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    articles: state.news.articles,
    currentPage: state.news.currentPage,
    loading: state.news.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout()),
    loadNews: () => dispatch(actions.getNews()),
    setCurrentPage: num => dispatch(actions.setCurrentPage(num)),
    setNextPage: pages => dispatch(actions.setNextPage(pages)),
    setPreviousPage: pages => dispatch(actions.setPreviousPage(pages))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(News);
