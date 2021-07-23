import React from 'react';
import './App.css';
import LoginPage from './pages/login/Login';
import RegisterPage from './pages/register/Register';
import HomePage from './pages/home/Home';

import { history } from './helpers/history'
import { Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from './helpers/ProtectedRoute'
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './Context/AuthContext'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-mui'

const alertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE
}

function App(props: any) {
  return (
    <div className="App">
      <AuthProvider>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Navbar/>
          <Router history={history}>
            <Switch>
              <ProtectedRoute exact path="/" component={HomePage} />
              <Route exact path="/login">
                <LoginPage/>
              </Route>
              <Route exact path="/register">
                <RegisterPage/>
              </Route> 
              <Route component={LoginPage}/>
            </Switch>
          </Router>
        </AlertProvider>
      </AuthProvider>
    </div>
  );
}

export default App
