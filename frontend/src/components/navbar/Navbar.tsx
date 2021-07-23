import { Link } from 'react-router-dom'
import { useContext } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../../Context/AuthContext'

const NavbarContainer = styled.nav`
  height: 50px;
  background-color: #4a148c;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 15px;
`

const NavbarItems = styled.div`
  display: flex;
  justify-content: end;
`

const StyledLink = styled(Link)`
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  &:not(:last-of-type) {
    margin-right: 25px;
  }
  border: 1px solid white;
  border-radius: 4px;
  padding: 7px 10px;
`

const StyledA = styled.a`
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  &:not(:last-of-type) {
    margin-right: 25px;
  }
  border: 1px solid white;
  border-radius: 4px;
  padding: 7px 10px;

  &:hover {
    cursor: pointer;
  }
`

const Navbar = () => {
  const { authenticated, handleLogout } = useContext(AuthContext)

  return(
    <NavbarContainer>
        {!authenticated ?
        <NavbarItems>
          <StyledLink to="/register">Register</StyledLink>
          <StyledLink to="/login">Login</StyledLink>
        </NavbarItems>
        :
        <NavbarItems>
          <StyledA onClick={handleLogout}>Logout</StyledA>
        </NavbarItems>
        }
    </NavbarContainer>
  )
}

export default Navbar