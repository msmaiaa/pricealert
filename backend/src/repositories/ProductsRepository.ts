import Product from '../models/Product'

type ProductType = { 
  url: string
  imgUrl: string
  name: string
  price: Number
  store: string
  usersWatching: [String]
  createdAt: Date
  updatedAt: Date
}

export default new class UserRepository {
  async findAll(userid: string) {
    try{
      const products = await Product.find().where('usersWatching').in([userid])
      return products
    }catch(e) {
      console.error(e)
      return e
    }
  }
}