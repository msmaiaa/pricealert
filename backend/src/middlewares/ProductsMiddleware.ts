import { NextFunction, Request, Response } from "express"
import ProductService from "../services/ProductService"


export default new class ProductsMiddleware {
  async filterProducts (req: any, res: Response, next: NextFunction) {
    const products = req.body.products
    const promises = products.map(async (productUrl: string) => {
      const productInDb = await ProductService.findByUrl(productUrl)
      if(productInDb) {
        await ProductService.insertUserIntoProduct(req.userid, productUrl)
        return false
      }
      return productUrl
    })
    const productsMapped = await Promise.all(promises)
    
    const filteredProducts = productsMapped.filter((product) => {
      return product
    })
    if (filteredProducts.length < 1) return res.status(200).send({ message: 'Products added' })
    req.body.products = filteredProducts
    next()
  }
}