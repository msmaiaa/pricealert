import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"
import styled from 'styled-components'
import { FaUser } from 'react-icons/fa'
import UserService from "../../services/UserService"
import { UserContext } from "../../Context/UserContext"

const HomePageContainer = styled.div`
  margin-top: 100px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ProductListContainer = styled.div`
  width: 800px;
  min-height: 400px;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 16px 18px;
`

const Header = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const HeaderText = styled.div`
  color: #000;
  margin-right: 10px;
`

const HeaderIcon = styled(FaUser)`
  height: 12px;
  width: 12px;
  margin-right: 5px;
`

const HomePage = () => {
  const { userProducts, handleUserProducts } = useContext(UserContext)
  const { userInfo, isLoading } = useContext(AuthContext)

  useEffect(()=> {
    if(userInfo) {
      handleUserProducts()
    }
  },[userInfo])

  useEffect(()=>{
    console.log(userProducts)
  }, [userProducts])

  if(isLoading) {
    return <HomePageContainer/>
  }
  if(userInfo) {
    return(
      <HomePageContainer>
        <ProductListContainer>
          <Header>
            <HeaderText>{userInfo.username}</HeaderText>
            <HeaderIcon/>
          </Header>
          {userProducts && userProducts.length < 1 && <p>Looks like that you don't have any saved products, try adding one</p>}
        </ProductListContainer>
      </HomePageContainer>
    )
  }
}

export default HomePage
