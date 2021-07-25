import { Request, Response } from 'express'
import EncryptionService from '../services/EncryptionService'
import UserService from '../services/UserService'
import AuthenticationService from '../services/AuthenticationService'

export default new class UserController {
  async register(req: Request, res: Response) {
    try{
      const { email, password, username } = req.body
      const createdUser = await UserService.registerUser({ email, username, password })
      if(createdUser.name === 'MongoError' && createdUser.code == 11000) {
        return res.status(422).send({ message: 'Email already in use!' });
      }
      if(createdUser) {
        return res.status(200).send({ user: createdUser, message: 'Registered with success' })
      }
      return res.status(404).send({ message: 'Internal server error' })
    }catch(e) {
      console.error(e)
      return res.status(400).send({message: 'Error while trying to register user'})
    }
  }

  async login(req: Request, res: Response) {
    try{
      const { email, password } = req.body
      const foundUser = await UserService.findUserByEmail(email)
      if(!foundUser || !EncryptionService.comparePassword(password, foundUser.password)) {
        return res.status(401).send({ message: 'Authentication failed. Invalid email or password.' })
      }
      const token = AuthenticationService.generateToken({ _id: foundUser._id, username: foundUser.username, email })
      const response = {
        token,
        sendDiscordNotifications: foundUser.sendDiscordNotifications,
        notifyIfPriceGoesHigher: foundUser.notifyIfPriceGoesHigher,
        notifyIfPriceGoesLower: foundUser.notifyIfPriceGoesLower,
        notifyIfProductIsOOS: foundUser.notifyIfProductIsOOS,
        discordHookUrl: foundUser.discordHookUrl,
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        created: foundUser.created
      }
      return res.status(200).send(response)
    }catch(e) {
      console.error(e)
      return res.status(400).send({ message: 'Error while trying to login user' })
    }
  }

  async update(req: any, res: Response) {
    try{
      const updateInfo = req.body.user
      delete updateInfo._id
      const userid = req.userid
      const updated = await UserService.updateUser(updateInfo, userid)
      if(updated) {
        return res.status(200).send({ message: 'Updated'})
      }
      return res.status(500).send({ message: 'Error while trying to update user' })
    }catch(e) {
      console.error(e)
      return res.status(500).send({ message:'Internal server error' })
    }
  }

}