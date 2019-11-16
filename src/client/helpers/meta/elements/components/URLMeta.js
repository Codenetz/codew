import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default function URLMeta({ title, description }) {
  return (
    <Helmet>
      {title && (
        <title>
          {title}
        </title>
      )}

      {description && (
        <meta
         name="description"
         content={description}/>
      )}
    </Helmet>
  );
}

URLMeta.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
