import ProductsRepository, { ProductType } from '../repositories/ProductsRepository'

export default new class ProductService {
  async findAllWithUserId(userid: string): Promise<Array<ProductType>> {
    const productsInDB = await ProductsRepository.findAll(userid)
    return productsInDB
  }
}