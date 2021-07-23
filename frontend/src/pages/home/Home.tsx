import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"

const HomePage = () => {
  const { userInfo } = useContext(AuthContext)
  useEffect(()=>{
    console.log(userInfo)
  },[])
  return(
    <p>{userInfo.email}</p>
  )
}

export default HomePage
