import React, {useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './views/pages/Login';
import './vibe/scss/styles.scss';

export default function App(props) {
  useEffect(() => {
    
  }, []);
  const flag = false;
  return (
    <BrowserRouter>
      <Switch>
        <Route component={DashboardLayout} />
      </Switch>
    </BrowserRouter>
  );
}
