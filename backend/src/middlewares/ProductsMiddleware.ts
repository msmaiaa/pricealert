import { NextFunction, Response } from "express"
import ProductService from "../services/ProductService"


export default new class ProductsMiddleware {
  async filterProducts (req: any, res: Response, next: NextFunction) {
    const products = req.body.products
    const promises = products.map(async (productUrl: string) => {
      const productInDb = await ProductService.findByUrl(productUrl)

      //if user already watching
      if(productInDb.usersWatching.includes(req.userid)) {
        console.log('includes userid')
        return false
      }

      //if product url already in use, just insert the user on the usersWatching field
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