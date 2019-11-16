import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default function FacebookMeta({ host, url, image, type, title }) {
  return (
    <Helmet>
      {title && (
        <meta
         property="og:title"
         content={title}/>
      )}
      {host && (
        <meta
         property="og:site_name"
         content={host}/>
      )}
      {image && (
        <meta
         property="og:image"
         content={image}/>
      )}
      {url && (
        <meta
         property="og:url"
         content={url}/>
      )}

      {type ? (
        <meta
         property="og:type"
         content={type}/>
      ) : (
        <meta
         property="og:type"
         content="website"/>
      )}
    </Helmet>
  );
}

FacebookMeta.propTypes = {
  host: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string
};
