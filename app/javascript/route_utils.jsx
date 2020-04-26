import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props =>
            rest.loggedInUser ? (
                <Component {...props} loggedInUser={rest.loggedInUser} />
            ) : (
                <Redirect to={{ pathname: '/' }} />
            )
        } />
    )
}

export default PrivateRoute
