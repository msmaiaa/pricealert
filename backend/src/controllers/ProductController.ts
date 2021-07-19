import ScrapingService from '../services/ScrapingService'
import ProductService from '../services/ProductService'
import { Response } from 'express'

export default new class ProductController {
  async index(req: any, res: Response) {
    try{
      const userid = req.userid
      const userProductsInDB = await ProductService.findAllWithUserId(userid)
      return res.status(200).send({ message: 'User products fetched with success', body: userProductsInDB })
    }catch(e) {
      console.error(e)
      return res.status(404).send({ message: 'Error while trying to fetch user products' })
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
      return res.status(404).send({ message: 'Error while trying to add product' })
    }
  }

  async put(req: any, res: Response) {
    return res.status(200).send({message: 'put'})
  }

  async delete(req: any, res: Response) {
    return res.status(200).send({message: 'delete'}) 
  }
}
