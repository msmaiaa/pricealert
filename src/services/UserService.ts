import axios from 'axios'
import authHeader from './AuthHeader'

const API_URL = process.env.REACT_APP_API_URL + 'api/products' || 'http://localhost:5000/api/products'

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
      const products = await axios.get(API_URL, { headers: authHeader() })
      return products
    }catch(error) {
      console.error(error)
    }
  }

  async insertProducts(products: Array<string>): Promise<any> {
    try{
      const insertedProducts = await axios.post(API_URL, { products: products  }, { headers: authHeader() })
      return insertedProducts
    }catch(error){
      console.error(error)
    }
  }

  async deleteProducts(products: Array<IProduct>): Promise<any> {
    try{
      const deletedProducts = await axios.delete(API_URL, { headers: authHeader(), data: { products: products }})
      return deletedProducts
    }catch(error){
      console.error(error)
    }
  }
}

export default new UserService()