import { useState } from 'react'
import { Button, TextField } from "@material-ui/core"
import UserService from "../../../services/UserService"
import styled from 'styled-components'
import { FaTrash } from 'react-icons/fa'
import { useAlert } from 'react-alert'

const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

const StyledButton = styled(Button)`
  width: 160px;
  text-transform: lowercase;
`

const TextFieldContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`

const StyledTextField = styled(TextField)`
  width: 300px;
`

const DeleteButton = styled.a`
text-align: center;
margin-left: 10px;
&:hover {
  cursor: pointer;
}
  color: red;
  width: 15px;
  height: 15px;
`

const ButtonsContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  display: flex;
  justify-content: space-around;
`

const AddProducts:React.FC = () => {
  const alert = useAlert()
  const [activeInputs, setActiveInputs] = useState<any>([""])

  const handleAddFieldClick = () => {
    setActiveInputs([...activeInputs, ""])
  }

  const handleDeleteFieldClick = (index: number) => {
    const list = [...activeInputs]
    list.splice(index, 1)
    setActiveInputs(list)
  }

  const handleFieldChange = (e: any, index: number) => {
    const url = e.target.value
    const list = [...activeInputs]
    list[index] = url
    setActiveInputs(list)
  }

  const handleSaveProducts = async() => {
    const saved = await UserService.insertProducts(activeInputs)
    if(saved) {
      if(saved.status === 200) {
        alert.show('Adding products to the database, they will show up in a few seconds.')
        setActiveInputs([])
      }else if(saved.status === 422){
        alert.show('Error while trying to add the products, some urls may be invalid')
      }
    }
  }

  return(
    <Container>
      <StyledForm noValidate autoComplete="off">
        {activeInputs.map((item: any, index: number)=> {
          return (
            <TextFieldContainer>
              <StyledTextField required key={index} id="standard-basic" label="url" value={item} onChange={(e: any) => handleFieldChange(e, index)}/>
              <DeleteButton onClick={()=> handleDeleteFieldClick(index)}>
                <FaTrash style={{ height: 15, width: 15}}/>
              </DeleteButton>
            </TextFieldContainer>
          )
        })}
      </StyledForm>
      <ButtonsContainer>
        <StyledButton variant="contained" color="secondary" type="submit" onClick={handleSaveProducts}>Save Products</StyledButton>
        <StyledButton variant="contained" color="primary" onClick={handleAddFieldClick}>Add url field</StyledButton>
      </ButtonsContainer>
    </Container>
  )
}

export default AddProducts