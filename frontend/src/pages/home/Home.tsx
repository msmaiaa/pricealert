import styled from 'styled-components'
import { Router, Link, Switch, useRouteMatch, Route } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import UserProducts from './userProducts/UserProducts'

const HomePageContainer = styled.div`
  margin-top: 100px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

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

const ProductListContainer = styled.div`
width: 850px;
min-height: 400px;
background-color: #fff;
display: flex;
align-items: center;
flex-direction: column;
padding: 16px 18px;
box-shadow: 3px 4px 3px 0px #000000;
`

interface IProduct {
  createdAt: string
  imgUlr: string
  name: string
  price: number
  store: string
  updatedAt: string
  url: string
  _id: string
}

const HomePage = () => {
  const { userInfo } = useContext(AuthContext)
  let { path, url } = useRouteMatch()

  if(!userInfo) {
    return <HomePageContainer></HomePageContainer>
  }
  return(
    <HomePageContainer>
      <ProductListContainer>
          <Header>
            <HeaderText>{userInfo.username}</HeaderText>
            <HeaderIcon/>
          </Header>
          <Switch>
            <Route exact path={path} component={UserProducts}/>
          </Switch>
      </ProductListContainer>
    </HomePageContainer>
  )
}

export default HomePage
