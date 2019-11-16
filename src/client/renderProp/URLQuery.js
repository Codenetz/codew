import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Query from 'utils/Query';

export default class URLQuery extends Component {
  render() {
    const { children, defaultProps } = this.props;

    return children(Object.assign({}, defaultProps, Query.getAllParameters()));
  }
}

URLQuery.propTypes = {
  children: PropTypes.func.isRequired,
  defaultProps: PropTypes.any
};

URLQuery.defaultProps = {
  defaultProps: {}
};
