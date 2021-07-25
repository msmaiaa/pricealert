import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import User from '../models/User'

type UserType = { 
  username: string
  password: string
  email: string
}

export default new class UserRepository {
  async insertOne ({username, password, email}: UserType) {
    try{
      const cryptedPassword = bcrypt.hashSync(password, 10)
      const createdUser = await User.create({
        username,
        email,
        password: cryptedPassword
      })
      if(createdUser) {
        delete createdUser.password
        return createdUser
      }
    }catch(ex) {
      console.error(ex)
      return ex
    }
  }

  async findOne (email: string) {
    try{
      const userInDB = await User.findOne({ email }).exec()
      return userInDB
    }catch(e) {
      console.error(e)
      return false
    }
  }

  async findOneById (_id: string) {
    try{
      const userInDB = await User.findOne({ _id }).exec()
      return userInDB
    }catch(e) {
      console.error(e)
      return false
    }
  }

  async updateOne (updateInfo: any, userid: string) {
    try{
      const userInDB = await User.updateOne({ _id: userid}, updateInfo)
      return userInDB
    }catch(e) {
      console.error(e)
      return false
    }
  }

}