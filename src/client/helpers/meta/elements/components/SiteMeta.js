import React from 'react';
import PropTypes from 'prop-types';
import URLMeta from './URLMeta';
import TwitterMeta from './TwitterMeta';
import FacebookMeta from './FacebookMeta';

export default function SiteMeta({ meta: { meta, og } }) {
  return (
    <div>
      <URLMeta {...meta}/>
      <TwitterMeta {...og}/>
      <FacebookMeta {...og}/>
    </div>
  );
}

SiteMeta.propTypes = {
  meta: PropTypes.object.isRequired
};
