import React, { createContext, useEffect, useState } from 'react'
import UserService from '../services/UserService'

const UserContext = createContext<any>(undefined)

const UserProvider: React.FC = ({children}) => {
  const [userProducts, setUserProducts] = useState<[]>()

  const handleUserProducts = async() => {
    try{
      const products = await UserService.getAllUserProducts()
      setUserProducts(products.data.body)
    }catch(e) {
      console.error(e)
    }
  }

  return(
    <UserContext.Provider value={{ userProducts, handleUserProducts }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }