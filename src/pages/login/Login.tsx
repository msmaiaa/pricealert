import styled from 'styled-components'
import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext'
import { history } from '../../helpers/history'
import { useAlert } from 'react-alert'



const LoginPageContainer = styled.div`
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

const LoginPage = () => {
  const { authenticated, handleLogin } = useContext(AuthContext)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const alert = useAlert()


  if(authenticated) {
    history.push('/home')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loggedIn = await handleLogin({ email, password })
    if(loggedIn.status === 401) {
      alert.show(loggedIn.data.message)
    }else{
      history.push('/home')
    }
    console.log({ email, password })
  }

  return(
    <LoginPageContainer>
      <FormContainer>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <StyledTextField color="secondary" label="email" variant="outlined" required type="email" onChange={(e) => setEmail(e.target.value)} />
          <StyledTextField color="secondary" label="password" variant="outlined" required type="password" onChange={(e) => setPassword(e.target.value)} />
          <ButtonContainer>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </LoginPageContainer>
  )
}

export default LoginPage