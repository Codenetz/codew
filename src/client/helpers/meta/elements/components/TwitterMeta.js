import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default function TwitterMeta({
  host,
  author,
  image,
  description,
  title
}) {
  return (
    <Helmet>
      {host && (
        <meta
         name="twitter:site"
         content={host}/>
      )}
      {author && (
        <meta
         name="twitter:creator"
         content={author}/>
      )}
      {image && (
        <meta
         name="twitter:image:src"
         content={image}/>
      )}
      {description && (
        <meta
         name="twitter:description"
         content={description}/>
      )}
      {title && (
        <meta
         name="twitter:title"
         content={title}/>
      )}
    </Helmet>
  );
}

TwitterMeta.propTypes = {
  host: PropTypes.string,
  author: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string
};
