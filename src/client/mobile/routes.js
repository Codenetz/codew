import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import LayoutRoute from '../helpers/routes/LayoutRoute';
import HomePage from './pages/HomePage';
import IsAuthorizedAdmin from '../helpers/middlewares/authorization/components/IsAuthorizedAdmin';
import IsAuthorizedUser from '../helpers/middlewares/authorization/components/IsAuthorizedUser';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import SignUpPage from './pages/SignUpPage';

class Routes extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      scrollTo(0, 0);
    }
  }
  render() {
    return (
      <Switch>
        <LayoutRoute
         exact
         path="/"
         layout={props => (
           <div>
             {props.children}
           </div>
         )}
         component={HomePage}/>

        <Route
         exact
         path="/logout"
         component={LogoutPage}/>

        <Route
         exact
         path="/login"
         render={props => {
           return (
           /** Force page reload when redirecting to admin because it is outside current app scope  */
             <IsAuthorizedAdmin
              onAuthorized={'/admin'}
              pageReload={true}>
               <IsAuthorizedUser onAuthorized={'/'}>
                 <LoginPage {...props}/>
               </IsAuthorizedUser>
             </IsAuthorizedAdmin>
           );
         }}/>

        <Route
         exact
         path="/sign-up"
         render={props => {
           return (
             <IsAuthorizedUser onAuthorized={'/'}>
               <SignUpPage {...props}/>
             </IsAuthorizedUser>
           );
         }}/>
      </Switch>
    );
  }
}

Routes.propTypes = {
  location: PropTypes.object
};

export default withRouter(props => <Routes {...props}/>);
