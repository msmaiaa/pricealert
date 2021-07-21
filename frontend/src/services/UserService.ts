import axios from 'axios'
import authHeader from './AuthHeader'

const API_URL = process.env.API_URL || 'http://localhost:5000/api/products'

interface IProduct {
  _id: string
  url: string
  store: string
  name: string
  price: number
  imgUrl: string
  createdAt: string
  updatedAt: string
}

class UserService {
  async getAllUserProducts(): Promise<Array<IProduct> | any> {
    try{
      const userProducts = await axios.get(API_URL, { headers: authHeader() })
      return userProducts.data
    }catch(e) {
      console.error(e)
    }
  }

  async insertProducts(products: Array<string>) {
    try{
      const insertedProducts = await axios.post(API_URL, { headers: authHeader() })
      return insertedProducts
    }catch(e) {
      console.error(e)
    }
  }

  async deleteProducts() {
    try{
      const deleted = await axios.delete(API_URL, { headers: authHeader() })
      return deleted
    }catch(e) {
      console.error(e)
    }
  }
}

export default new UserService()