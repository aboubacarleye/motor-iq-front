import React from 'react';
import { Router, Route, Switch } from 'wouter';
import WebLandingScreen from './screens/WebLandingScreen';
import DashboardScreen from './screens/DashboardScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import ReportAccidentScreen from './screens/ReportAccidentScreen';
import AssistantChatScreen from './screens/AssistantChatScreen';
import UpgradeInsuranceScreen from './screens/UpgradeInsuranceScreen';
import ClaimsTrackingScreen from './screens/ClaimsTrackingScreen';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={WebLandingScreen} />
        <Route path="/app" component={DashboardScreen} />
        <Route path="/app/report" component={ReportAccidentScreen} />
        <Route path="/app/assistant" component={AssistantChatScreen} />
        <Route path="/app/upgrade" component={UpgradeInsuranceScreen} />
        <Route path="/app/claims" component={ClaimsTrackingScreen} />
        <Route path="/admin" component={AdminDashboardScreen} />
        <Route>404</Route>
      </Switch>
    </Router>
  );
}