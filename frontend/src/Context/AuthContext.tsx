import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { history } from '../helpers/history'
import AuthService, { ILoginFormParams } from '../services/AuthService'

const AuthContext = createContext<any>(undefined)

const AuthProvider: React.FC = ({children}) => {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('user') ? true : false)
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const user: any = localStorage.getItem('user')

    if(user) {
      axios.defaults.headers.Authorization = 'x-access-token: ' + user.token 
      setUserInfo(JSON.parse(user))
      setAuthenticated(true)
    }

    setLoading(false)
  },[])

  
  async function handleLogin({ email, password }: ILoginFormParams) {
    const userData = await AuthService.login({ email, password})
    if(userData.status === 200) {
      setAuthenticated(true)
      setUserInfo(userData.data)
      return userData
    }else if(userData.status === 401){
      return userData
    }
  }
  
  async function handleLogout() {
    setAuthenticated(false)
    localStorage.removeItem('user')
    axios.defaults.headers.Authorization = undefined 
    history.push('/login')
  }

  if(isLoading) {
    return <h1>Loading...</h1>
  }

  return(
    <AuthContext.Provider value={{ authenticated, handleLogin, handleLogout, userInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }