import React from 'react';
import './App.css';
import LoginPage from './pages/login/Login';
import RegisterPage from './pages/register/Register';
import HomePage from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import ProtectedRoute from './helpers/ProtectedRoute'
import { AuthProvider } from './Context/AuthContext'
import { UserProvider } from './Context/UserContext';
import { Switch, Route } from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-mui'

const alertOptions = {
  position: positions.BOTTOM_LEFT,
  timeout: 3000,
  offset: '30px',
  transition: transitions.SCALE,
  type: 'info'
}

function App(props: any) {
  return (
    <div className="App">
      <AuthProvider>
        <Navbar/>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
            <Switch>
              <Route path="/login" component={LoginPage}/>
              <Route path="/register" component={RegisterPage}/>
              <UserProvider>
                <ProtectedRoute path="/" component={HomePage} />
              </UserProvider>
              <Route component={LoginPage}/>
            </Switch>
        </AlertProvider>
      </AuthProvider>
    </div>
    )}

export default App
