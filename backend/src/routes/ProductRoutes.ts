import express from 'express'
import ProductController from '../controllers/ProductController'
import verifyJWT from '../utils/JWTHelper'
import ProductsMiddleware from '../middlewares/ProductsMiddleware'

const ProductRoutes = express.Router()

ProductRoutes.get('/', verifyJWT, ProductController.index)
ProductRoutes.post('/', verifyJWT, ProductsMiddleware.filterProducts, ProductController.post)
ProductRoutes.delete('/', verifyJWT, ProductController.delete)

export default ProductRoutes