import ScrapingService from '../services/ScrapingService'
import ProductService from '../services/ProductService'
import { Response } from 'express'
import { ProductType } from '../repositories/ProductsRepository'

export default new class ProductController {
  async index(req: any, res: Response) {
    try{
      const userid = req.userid
      const userProductsInDB = await ProductService.findAllWithUserId(userid)
      return res.status(200).send({ message: 'User products fetched with success', body: userProductsInDB })
    }catch(e) {
      console.error(e)
      return res.status(500).send({ message: 'Error while trying to fetch user products' })
    }
  }

  async post(req: any, res: Response) {
    try{
      const userid = req.userid
      res.status(200).send({message: 'Adding products to the database'})
      const productsWithInfo = await ScrapingService.getManyProductsInfo(req.body.products)
      await ProductService.insertProducts({userid, products: productsWithInfo})
      return
    }catch(e) {
      console.error(e)
      return res.status(500).send({ message: 'Error while trying to add product' })
    }
  }

  async delete(req: any, res: Response) {
    try{
      const userid: string = req.userid
      const products: Array<ProductType> = req.body.products
      const deletedProducts = await ProductService.deleteProducts(userid, products)

      if(!deletedProducts || deletedProducts.length < 1) return res.status(500).send({ message: "Couldn't delete the products" })
      return res.status(200).send({ message: 'Products deleted with success!' }) 
    }catch(e) {
      console.error(e)
      return res.status(500).send({ message: 'Error while trying to delete product' })
    }
  }
}
