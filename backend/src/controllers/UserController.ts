import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import UserRepository from '../repositories/UserRepository'
import EncryptionHelper from '../helpers/EncryptionHelper'

export default new class UserController {
  async register(req: Request, res: Response) {
    try{
      const createdUser = await UserRepository.register(req.body)
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
      const foundUser = await UserRepository.findOne(email)
      if(!foundUser || !EncryptionHelper.comparePassword(password, foundUser.password)) {
        return res.status(401).json({ message: 'Authentication failed. Invalid email or password.' })
      }
      const token = jwt.sign({ _id: foundUser._id}, `${process.env.JWT_PRIVATE}`, { expiresIn: "2 days" })
      return res.json({token, username: foundUser.username, products: foundUser.products, email: foundUser.email })
    }catch(e) {
      console.error(e)
      return res.status(400).json({ message: 'Error while trying to login user' })
    }
  }

}