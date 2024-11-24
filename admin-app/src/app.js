import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from './layouts/Admin.jsx';
import RestaurantLayout from './layouts/Restaurant.jsx';
import AuthLayout from './layouts/Auth.jsx';
import SuperAdminLayout from './layouts/SuperAdmin.jsx';
import { PrivateRoute } from './views/PrivateRoute';
import { AdminPrivateRoute } from './views/AdminPrivateRoute';
import ConfigurableValues from './config/constants.js';
import useGlobalStyles from './utils/globalStyles';
require('./i18n');

const App = () => {
  const globalClasses = useGlobalStyles();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const user = localStorage.getItem('user-enatega');
  const userType = user ? JSON.parse(user).userType : null;

  const route = userType
    ? userType === 'VENDOR'
      ? '/restaurant/list'
      : '/super_admin/vendors'
    : '/auth/login';

  return (
    <div>
      {isOffline ? (
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100vh"
          bgcolor="white"
          color="black"
          fontSize="20px"
          zIndex={1000}
        >
          <Box
            component="img"
            sx={{
              width: 100,
              height: 'auto',
              maxWidth: { xs: '100px', sm: '200px', md: '300px' },
            }}
            alt="No internet"
            src="/nointernet.svg"
          />
          <Typography variant="body" style={{ fontSize: '16px', marginTop: '5px' }}>
            OOPs! No internet.
          </Typography>
          <Typography variant="body" style={{ fontSize: '16px', marginTop: '5px' }}>
            Try to refresh the page.
          </Typography>
          <Button
            className={globalClasses.button}
            onClick={handleRefresh}
            style={{ marginTop: '16px' }}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <HashRouter basename="/">
          <Switch>
            <AdminPrivateRoute
              path="/super_admin"
              component={(props) => <SuperAdminLayout {...props} />}
            />
            <PrivateRoute
              path="/restaurant"
              component={(props) => <RestaurantLayout {...props} />}
            />
            <PrivateRoute
              path="/admin"
              component={(props) => <AdminLayout {...props} />}
            />
            <Route
              path="/auth"
              component={(props) => <AuthLayout {...props} />}
            />
            <Redirect from="/" to={route} />
          </Switch>
        </HashRouter>
      )}
    </div>
  );
};

export default App;
