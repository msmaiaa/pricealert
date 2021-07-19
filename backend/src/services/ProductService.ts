import ProductsRepository, { ProductType } from '../repositories/ProductsRepository'

export default new class ProductService {
  async findAllWithUserId(userid: string): Promise<Array<ProductType>> {
    const productsInDB = await ProductsRepository.findAllByUserId(userid)
    return productsInDB
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
}