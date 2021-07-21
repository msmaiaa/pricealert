import jwt from 'jsonwebtoken'
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
        return res.status(200).json({ user: createdUser, message: 'Registered with success' })
      }
      return res.status(404).json({ message: 'Internal server error' })
    }catch(e) {
      console.error(e)
      return res.status(400).json({message: 'Error while trying to register user'})
    }
  }

  async login(req: Request, res: Response) {
    try{
      const { email, password } = req.body
      const foundUser = await UserService.findUserByEmail(email)
      if(!foundUser || !EncryptionService.comparePassword(password, foundUser.password)) {
        return res.status(401).json({ message: 'Authentication failed. Invalid email or password.' })
      }
      const token = AuthenticationService.generateToken({ _id: foundUser._id, username: foundUser.username, email })
      return res.json({token, user: {username: foundUser.username, products: foundUser.products, email: foundUser.email, _id: foundUser._id }})
    }catch(e) {
      console.error(e)
      return res.status(400).json({ message: 'Error while trying to login user' })
    }
  }

}