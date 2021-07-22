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
  async getAllUserProducts(): Promise<any> {
    return axios.get(API_URL, { headers: authHeader() })
  }

  async insertProducts(products: Array<string>) {
    return axios.post(API_URL, { headers: authHeader() })
  }

  async deleteProducts() {
    return axios.delete(API_URL, { headers: authHeader() })
  }
}

export default new UserService()