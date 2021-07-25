import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../../Context/AuthContext';
import styled from 'styled-components'
import { useAlert } from 'react-alert'
import AuthService from '../../../services/AuthService';

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
margin-top: 15px;
margin-bottom: 15px;
`

const InputContainer = styled.div`
display: flex;
width: 100%;
align-items: center;
`

const InputLabel = styled.p`
  font-size: 18px;
  font-weight: 400;
  width: 50%;
  display: flex;
  justify-content: flex-end;
`

const InputField = styled.form`
  width: 50%;
  display: flex;
  align-items: center;
  margin-left: 25px;
`

const UserSettings:React.FC = () => {
  const alert = useAlert()
  const { userInfo } = useContext(AuthContext)
  const [urlField, setUrlField] = useState('')
  const [sendDiscord, setSendDiscord] = useState(false)
  const [sendPriceHigher, setSendPriceHigher] = useState(false)
  const [sendOutOfStock, setSendOutOfStock] = useState(false)
  const [sendPriceLower, setSendPriceLower] = useState(false)

  const handleInputChange = (e: any) => {
    setUrlField(e.target.value)
  }

  const handleUpdateClick = async() => {
    const actualUser = {...userInfo}
    actualUser.sendDsicordNotifications = sendDiscord
    actualUser.notifyIfPriceGoesHigher = sendPriceHigher
    actualUser.notifyIfPriceGoesLower = sendPriceLower
    actualUser.notifyIfProductIsOOS = sendOutOfStock
    actualUser.discordHookUrl = urlField
    delete actualUser.token
    const updated = await AuthService.updateUser(actualUser)
    if(updated) {
      if(updated.status === 200) {
        alert.show('User settings updated')
      }else{
        alert.show("Couldn't update user settings")
      }
    }
  }

  useEffect(()=> {
    setSendDiscord(userInfo.sendDiscordNotifications)
    setSendPriceHigher(userInfo.notifyIfPriceGoesHigher)
    setSendPriceLower(userInfo.notifyIfPriceGoesLower)
    setSendOutOfStock(userInfo.notifyIfProductIsOOS)
    setUrlField(userInfo.discordHookUrl)
  }, [userInfo])

  useEffect(() => {
    if(!sendDiscord && userInfo && (sendPriceHigher || sendOutOfStock || sendPriceLower)) {
      setSendPriceHigher(false)
      setSendPriceLower(false)
      setSendOutOfStock(false)
    }
  }, [sendDiscord])

  return(
    <Container>
      <InputContainer>
        <InputLabel>Discord webhook url</InputLabel>
        <InputField>
          <TextField size="small" id="standard-basic" value={urlField} onChange={handleInputChange}/>
        </InputField>
      </InputContainer>
      <InputContainer>
        <InputLabel>Send discord notifications</InputLabel>
        <Checkbox onChange={(e)=> setSendDiscord(e.target.checked)} checked={sendDiscord}/>
      </InputContainer>
      <InputContainer>
        <InputLabel>Send notification if the price goes lower</InputLabel>
        <Checkbox onChange={(e)=> setSendPriceLower(e.target.checked)} checked={sendPriceLower}/>
      </InputContainer>
      <InputContainer>
        <InputLabel>Send notification if the product is out of stock</InputLabel>
        <Checkbox onChange={(e)=> setSendOutOfStock(e.target.checked)} checked={sendOutOfStock}/>
      </InputContainer>
      <InputContainer>
        <InputLabel>Send notification if the price goes higher</InputLabel>
        <Checkbox onChange={(e)=> setSendPriceHigher(e.target.checked)} checked={sendPriceHigher}/>
      </InputContainer>
      <Button color="primary" variant="contained" onClick={handleUpdateClick}>Update</Button>
    </Container>
  )
}

export default UserSettings