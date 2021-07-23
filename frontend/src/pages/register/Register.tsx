import styled from 'styled-components'
import { Button, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext'
import AuthService from '../../services/AuthService';
import { history } from '../../helpers/history'
import { useAlert } from 'react-alert'



const RegisterPageContainer = styled.div`
  margin-top: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FormContainer = styled.div`
  width: 300px;
  box-shadow: 1px 1px 15px -2px #000000;
  padding: 20px 30px;
  border-radius: 5px;
  background-color: #fff;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledTextField = styled(TextField)`
  &:not(:last-of-type) {
    margin-bottom: 25px;
  }
  max-width: 250px;
`

const ButtonContainer = styled.div`
  margin-top: 15px;
`

const RegisterPage = () => {
  const { authenticated } = useContext(AuthContext)
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const alert = useAlert()


  if(authenticated) {
    history.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const registered = await AuthService.register({ username, email, password})
    if(registered.status !== 200) {
      alert.show(registered.data.message)
    }else{
      history.push('/login')
    }
    console.log({ email, password })
  }

  return(
    <RegisterPageContainer>
      <FormContainer>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <StyledTextField color="secondary" label="email" variant="outlined" required type="email" onChange={(e) => setEmail(e.target.value)} />
          <StyledTextField color="secondary" label="username" variant="outlined" required type="text" onChange={(e) => setUsername(e.target.value)} />
          <StyledTextField color="secondary" label="password" variant="outlined" required type="password" onChange={(e) => setPassword(e.target.value)} />
          <ButtonContainer>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </RegisterPageContainer>
  )
}

export default RegisterPage