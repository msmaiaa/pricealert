import { Response } from 'express'
import ProductsRepository from '../repositories/ProductsRepository'
import ScrapingService from '../services/ScrapingService'

export default new class ProductController {
  async index(req: any, res: Response) {
    try{
      const userid = req.userid
      const productsInDB = await ProductsRepository.findAll(userid)
      return res.status(200).send({ message: 'User products fetched with success', body: productsInDB })
    }catch(e) {
      console.error(e)
      return res.status(404).send({ message: 'Error while trying to fetch user products' })
    }
  }

  async post(req: any, res: Response) {
    try{
      const userid = req.userid
      res.status(200).send({message: 'Adding products to the database'})
      const productsWithInfo = await ScrapingService.getManyProductsInfo(req.body.products, userid)
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
