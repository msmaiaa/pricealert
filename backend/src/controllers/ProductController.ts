import { Request, Response } from 'express'
import ProductsRepository from '../repositories/ProductsRepository'

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

  async post(req: Request, res: Response) {
    return res.status(200).send({message: 'post'})
  }

  async put(req: Request, res: Response) {
    return res.status(200).send({message: 'put'})
  }

  async delete(req: Request, res: Response) {
    return res.status(200).send({message: 'delete'}) 
  }
}
