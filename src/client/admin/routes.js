import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import IsAuthorizedAdmin from '../helpers/middlewares/authorization/components/IsAuthorizedAdmin';
import DashboardPage from './pages/DashboardPage';

const AdminAuthorizedPage = props => {
  return (
    <IsAuthorizedAdmin
     onUnAuthorized={'/login'}
     pageReload={true}>
      {props.children}
    </IsAuthorizedAdmin>
  );
};

AdminAuthorizedPage.propTypes = {
  children: PropTypes.node
};

class Routes extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      scrollTo(0, 0);
    }
  }
  render() {
    return (
      <Switch>
        <Route
         exact
         path="/admin"
         render={props => (
           <AdminAuthorizedPage>
             <DashboardPage {...props}/>
           </AdminAuthorizedPage>
         )}/>
      </Switch>
    );
  }
}

Routes.propTypes = {
  location: PropTypes.object
};

export default withRouter(props => <Routes {...props}/>);
