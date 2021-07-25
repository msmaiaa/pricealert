import ProductsRepository, { ProductType } from '../repositories/ProductsRepository'
import UserService from './UserService'

export default new class ProductService {
  async findAllWithUserId(userid: string): Promise<Array<ProductType>> {
    const productsInDB = await ProductsRepository.findAllByUserId(userid)
    const filteredProducts = productsInDB.map((product: ProductType | any) => {
      return this.removeFieldFromProductObject('usersWatching', product)
    })
    return filteredProducts
  }

  removeFieldFromProductObject(field: string, product: any) {
    const filteredProduct = {...product._doc}
    delete filteredProduct[field]
    return filteredProduct
  }

  async findByUrl(url: string): Promise<any> {
    const productInDB = await ProductsRepository.findByUrl(url)
    return productInDB
  }

  async insertUserIntoProduct(userid: string, productUrl: string) {
    try{
      const productInDb = await ProductsRepository.findByUrl(productUrl)
      productInDb.usersWatching.push(userid)
      await productInDb.save()
      return productInDb
    }catch(e) {
      console.error(e)
      return
    }
  }

  async insertProducts({ userid, products}: any): Promise<any> {
    try{
      await ProductsRepository.create(userid, products)
      return
    }catch(e) {
      console.error(e)
    }
  }

  async deleteProducts(userid: string, products: Array<ProductType>) {
    try{
      const productsIdList: Array<string | undefined> = products.map((product) => {
        return product._id
      })
      const productsToDelete = await ProductsRepository.findAllByIdArray(productsIdList)
      const productsToDeletePromises = productsToDelete.map((productInMap: ProductType | any) => {
        if(productInMap.usersWatching?.length === 1) {
          return ProductsRepository.deleteProductById(productInMap._id)
        }
        return ProductsRepository.deleteUserFromProduct(userid, productInMap._id)
      })
      const deleted = Promise.all(productsToDeletePromises)
      return deleted
    }catch(e) {
      console.error(e)
      return false
    }
  }

  async getAllProducts() {
    try{
      const products = await ProductsRepository.findAll()
      return products
    }catch(e) {
      console.error(e)
    }
  }

  async getUsersFromProduct(product: any): Promise<any> {
    try{
      const usersMap = product.usersWatching.map(async(userid: string) => {
        const user = await UserService.findUserById(userid)
        return user
      })
      const users = await Promise.all(usersMap)
      return users
    }catch(e) {
      console.error(e)
    }
  }

  async updateProductPrice(product: ProductType, newPrice: number): Promise<any> {
    try{
      const updated = await ProductsRepository.updateOne({ _id:product._id, updateInfo: {price: newPrice}})
      return updated
    }catch(e) {
      console.error(e)
    }
  }
}