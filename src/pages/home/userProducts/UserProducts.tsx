import generateDataTableColumns from "../../../helpers/generateDataTableColumns"
import { UserContext } from "../../../Context/UserContext"

import { Button } from "@material-ui/core"
import styled from 'styled-components'
import DataTable from 'react-data-table-component'
import { useContext, useEffect, useState } from "react"
import { useAlert } from 'react-alert'
import { AuthContext } from "../../../Context/AuthContext"
import UserService from "../../../services/UserService"


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

const ProductListContainer = styled.div`
display: flex;
align-items: center;
flex-direction: column;
width: 100%;
`

const UserProducts = () => {
  const { userInfo, isLoading } = useContext(AuthContext)
  const alert = useAlert()
  const { userProducts, handleUserProducts } = useContext(UserContext)
  const [toggledClearRows, setToggledClearRows] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])

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

  if(isLoading && !userInfo) {
    return(
      <p>Loading</p>
    )
  }
  return(
    <ProductListContainer>
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
  )
}

export default UserProducts