import Product from '../models/Product'

export type ProductType = { 
  url: string
  imgUrl: string
  name: string
  price: Number
  store: string
  usersWatching?: [String]
  createdAt?: Date
  updatedAt?: Date
}


export default new class ProductRepository {
  async findAllByUserId(userid: string) {
    try{
      const products = await Product.find().where('usersWatching').in(userid)
      return products
    }catch(e) {
      console.error(e)
      return e
    }
  }

  async findByUrl(url: string) {
    try{
      const product = await Product.findOne().where(url)
      return product
    }catch(e) {
      console.error(e)
      return e
    }
  }

  async create(userid: string, products: Array<any>) {
    try{
      for(let product of products) {
        await Product.create({
          ...product,
          usersWatching: [
            userid
          ]
        })
      }
      return
    }catch(e) {
      console.error(e)
    }
  }
}