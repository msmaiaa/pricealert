import express from 'express'
import ProductController from '../controllers/ProductController'
import verifyJWT from '../utils/JWTHelper'

const ProductRoutes = express.Router()

ProductRoutes.get('/', verifyJWT, ProductController.index)
ProductRoutes.post('/', verifyJWT, ProductController.post)
ProductRoutes.put('/', verifyJWT, ProductController.put)
ProductRoutes.delete('/', verifyJWT, ProductController.delete)

export default ProductRoutes