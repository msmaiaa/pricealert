import { useContext } from 'react'
import { Redirect, Route } from 'react-router'
import { AuthContext } from '../Context/AuthContext'

export const ProtectedRoute = ({ ...rest }) => {
  const { authenticated } = useContext(AuthContext)

  if(!authenticated) {
    return <Redirect to="/login"/>
  }

  return <Route {...rest}/>
}

export default ProtectedRoute