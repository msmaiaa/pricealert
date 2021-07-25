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
  _id?: string
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
  
  async findAllByIdArray(productsArray: Array<string | undefined>) {
    try{
      const products = await Product.find({
        _id: { $in: productsArray }
      })
      return products
    }catch(e) {
      console.error(e)
      return false
    }
  }

  async findByUrl(url: string) {
    try{
      const product = await Product.findOne({ url })
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

  async deleteUserFromProduct(userid: string, productId: string) {
    try{
      const userRemoved = Product.updateOne({ _id: productId}, {
        $pull: {
          usersWatching: userid
        }
      })
      return userRemoved
    }catch(e) {
      console.error(e)
    }
  }

  async deleteProductById(productId: string) {
    try{
      const deletedProduct = Product.deleteOne({ _id: productId })
      return deletedProduct
    }catch(e) {
      console.error(e)
    }
  }

  async findAll() {
    try{
      const productsInDb = await Product.find()
      return productsInDb
    }catch(e) {
      console.error(e)
    }
  }

  async updateOne ({_id, updateInfo}: any) {
    try{
      const productInDb = await Product.updateOne({ _id }, updateInfo)
      return productInDb
    }catch(e) {
      console.error(e)
      return false
    }
  }
}