import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Meta from '../meta/elements/components/Meta';

export default function LayoutRoute({
  component: Component,
  layout: Layout,
  ...restProps
}) {
  return (
    <Route
     {...restProps}
     render={props => {
       return (
         <Meta {...props}>
           <Layout {...props}>
             <Component {...props}/>
           </Layout>
         </Meta>
       );
     }}/>
  );
}

LayoutRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  layout: PropTypes.elementType.isRequired
};
