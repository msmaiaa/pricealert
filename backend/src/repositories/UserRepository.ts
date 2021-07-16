import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import User from '../models/User'

type UserType = { 
  login: string
  password: string
  email: string
}

export default new class UserRepository {
  async register ({login, password, email}: UserType) {
    try{
      const createdUser = await User.create({
        username: login,
        email,
        password: bcrypt.hashSync(password, process.env.SALT || 10)
      })
      if(createdUser) {
        delete createdUser.password
        return createdUser
      }
    }catch(ex) {
      console.error(ex)
      return false
    }
  }

  async findOne (email: string) {
    try{
      const userInDB = await User.findOne({ email })
      return userInDB
    }catch(e) {
      console.error(e)
      return false
    }
  }
}