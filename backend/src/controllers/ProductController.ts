import { Request, Response } from 'express'

export default new class ProductController {
  async index(req: Request,res: Response): Promise<any> {
    return res.status(200).send({message: 'index'})
  }

  async post(req: Request,res: Response): Promise<any> {
    return res.status(200).send({message: 'post'})
  }

  async put(req: Request,res: Response): Promise<any> {
    return res.status(200).send({message: 'put'})
  }

  async delete(req: Request,res: Response): Promise<any> {
    return res.status(200).send({message: 'delete'}) 
  }
}
