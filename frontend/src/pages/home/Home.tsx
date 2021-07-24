import styled from 'styled-components'
import { Router, Link, Switch, useRouteMatch, Route } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import UserProducts from './userProducts/UserProducts'
import AddProducts from './addProducts/AddProducts'
import UserSettings from './userSettings/UserSettings'

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
color: #fff;
margin-right: 10px;

transition: all .2s;
`

const HeaderIcon = styled(FaUser)`
height: 12px;
width: 12px;
margin-right: 5px;
`

const HeaderButton = styled(Link)`
background-color: #4a148c;
box-shadow: 2px 2px 0px 2px #000000;

color: #fff;
display: flex;
align-items: center;
justify-content: center;
&:not(:last-child) {
  margin-right: 25px;
}
font-size: 14px;
padding: 8px 16px;

transition: all .2s;
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
            <HeaderButton to={`${path}/`}>products</HeaderButton>
            <HeaderButton to={`${path}/add`}>insert product</HeaderButton>
            <HeaderButton to={`${path}/settings`}>
              <HeaderText>settings</HeaderText>
              <HeaderIcon/>
            </HeaderButton>
          </Header>
          <Switch>
            <Route exact path={path} component={UserProducts}/>
            <Route path={`${path}/add`} component={AddProducts}/>
            <Route exact path={`${path}/settings`} component={UserSettings}/>
          </Switch>
      </ProductListContainer>
    </HomePageContainer>
  )
}

export default HomePage
