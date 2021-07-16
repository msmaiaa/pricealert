import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import UserController from '../controllers/UserController'

const AuthRoutes = express.Router()

AuthRoutes.post('/login',UserController.login)


export default AuthRoutes