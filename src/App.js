import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginLayout from './layouts/LoginLayout';
import './vibe/scss/styles.scss';

export default function App(props) {
  useEffect(() => {}, []);
  const flag = false;
  return (
    <Router>
      <Switch>
        <Route path="/" component={DashboardLayout} />
      </Switch>
    </Router>
  );
}
