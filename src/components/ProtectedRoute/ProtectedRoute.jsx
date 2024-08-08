import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import LoginPage from '../LoginPage/LoginPage';
import {useSelector} from 'react-redux';

function ProtectedRoute({ component: Component, allowedLevels, ...props }) {
  const user = useSelector((store) => store.user);

  return (
    <Route
      {...props}
      render={(routeProps) => {
        // If we have no user, redirect to login
        if (!user?.id) {
          return <Redirect to="/login" />;
        }
        
        // If allowedLevels is specified, check if the user's access level is included
        if (allowedLevels && !allowedLevels.includes(String(user.access_level))) {
          return <Redirect to="/unauthorized" />;
        }
        
        // If we make it here, render the protected component
        return <Component {...routeProps} />;
      }}
    />
  );
}

export default ProtectedRoute;