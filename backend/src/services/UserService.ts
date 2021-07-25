import { ProductType } from "../repositories/ProductsRepository"
import UserRepository from "../repositories/UserRepository"

interface IUserRegistrationBody {
  email: string
  password: string
  username: string
}

export default new class UserService {
  async registerUser ({email, password, username}: IUserRegistrationBody) {
    try{
      const createdUser = await UserRepository.insertOne({email, password, username})
      return createdUser
    }catch(e) {
      console.error(e)
      return e
    }
  }

  async findUserByEmail(email: string) {
    try{
      const foundUser = await UserRepository.findOne(email)
      return foundUser
    }catch(e) {
      console.error(e)
      return e
    }
  }

  async findUserById(id: string) {
    try{
      const foundUser = await UserRepository.findOneById(id)
      return foundUser
    }catch(e) {
      console.error(e)
      return e
    }
  }

  async updateUser(updateInfo: any, userid: string) {
    try{
      const foundUser = await UserRepository.updateOne(updateInfo, userid)
      return foundUser
    }catch(e) {
      console.error(e)
      return e
    }
  }
}