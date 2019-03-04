import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {inject, observer} from 'mobx-react';

@observer
class PrivateRoute extends Component {
  render() {
    let {
      component: TargetComponent,
      auth,
      ...rest
    } = this.props;
    return (
      <Route
        {...rest}
        render={props => auth
        ? (<TargetComponent {...props}/>)
        : (<Redirect
          to={{
          pathname: "/login",
          state: {
            from: props.location
          }
        }}/>)}/>
    );
  }
}

PrivateRoute.defaultProps = {
  auth: false,
  routes: []
};

const InjectPrivateRoute = inject(({authStore={}}) => ({auth: authStore.logged}))(PrivateRoute);

export {
  PrivateRoute,
  InjectPrivateRoute
};