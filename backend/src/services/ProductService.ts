import ProductsRepository, { ProductType } from '../repositories/ProductsRepository'

export default new class ProductService {
  async findAllWithUserId(userid: string): Promise<Array<ProductType>> {
    const productsInDB = await ProductsRepository.findAllByUserId(userid)
    const filteredProducts = productsInDB.map((product: ProductType | any) => {
      return this.removeFieldFromUserObject('usersWatching', product)
    })
    return filteredProducts
  }

  removeFieldFromUserObject(field: string, product: any) {
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
      return productsToDelete
    }catch(e) {
      console.error(e)
      return false
    }
  }
}