import { NextFunction, Request, Response } from "express"
import ProductService from "../services/ProductService"


export default new class ProductsMiddleware {
  async filterProducts (req: any, res: Response, next: NextFunction) {
    const products = req.body.products
    const promises = products.map(async (productUrl: string) => {
      const productInDb = await ProductService.findByUrl(productUrl)
      if(productInDb.length > 0) {
        await ProductService.insertUserIntoProduct(req.userid, productUrl)
        return false
      }
      return productUrl
    })
    const productsMapped = await Promise.all(promises)
    
    const filteredProducts = productsMapped.filter((product) => {
      return product
    })
    req.body.products = filteredProducts
    next()
  }
}