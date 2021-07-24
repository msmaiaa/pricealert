import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"
import styled from 'styled-components'
import { FaUser } from 'react-icons/fa'
import generateDataTableColumns from "../../helpers/generateDataTableColumns"
import DataTable from 'react-data-table-component'
import { UserContext } from "../../Context/UserContext"
import { Button } from "@material-ui/core"
import { useAlert } from 'react-alert'
import UserService from "../../services/UserService"

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
  box-shadow: 3px 4px 3px 0px #000000;
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

const ProductList = styled.div`
  width: 100%;
  min-height: 200px;
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`

const StyledButton = styled(Button)`

`

const ProductListHeaderContainer = styled.div`
  display: flex;
  align-items: flex-end;
`

const ProductListTitle = styled.p`
  font-size: 26px;
  margin: 0;
  font-weight: 300;
  display: block;
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
  const alert = useAlert()
  const { userProducts, handleUserProducts } = useContext(UserContext)
  const { userInfo, isLoading } = useContext(AuthContext)
  const [selectedRows, setSelectedRows] = useState([])
  const [toggledClearRows, setToggledClearRows] = useState(false)

  useEffect(()=> {
    if(userInfo) {
      handleUserProducts()
    }
  },[userInfo])

  const handleDeleteProducts = async() => {
    const deleted = await UserService.deleteProducts(selectedRows)
    if(deleted.status === 200) {
      handleUserProducts()
      setToggledClearRows(true)
      setSelectedRows([])
      setToggledClearRows(false)
      return
    }
    alert.show('Error while trying to delete the products.')
  }

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
          {userProducts && userProducts.length >= 1 &&
            <ProductList>
              <ProductListHeaderContainer>
                <ProductListTitle>Products</ProductListTitle>
              </ProductListHeaderContainer>
              <DataTable 
                columns={generateDataTableColumns()}
                data={userProducts}
                selectableRows
                onSelectedRowsChange={(state: any) => setSelectedRows(state.selectedRows)}
                clearSelectedRows={toggledClearRows}
              />
            </ProductList>
          }
          {selectedRows.length > 0 && 
            <StyledButton variant="contained" color="secondary" onClick={handleDeleteProducts}>
            Delete
            </StyledButton>
          }
        </ProductListContainer>
      </HomePageContainer>
    )
  }
}

export default HomePage
