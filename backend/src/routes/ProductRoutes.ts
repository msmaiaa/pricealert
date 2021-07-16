import express from 'express'
import ProductController from '../controllers/ProductController'

const ProductRoutes = express.Router()

ProductRoutes.get('/user/:userid/', ProductController.index)
ProductRoutes.post('/user/:userid/', ProductController.post)
ProductRoutes.put('/user/:userid/', ProductController.put)
ProductRoutes.delete('/user/:userid/', ProductController.delete)

export default ProductRoutes