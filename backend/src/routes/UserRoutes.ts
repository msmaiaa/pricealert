import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import UserController from '../controllers/UserController'

const UserRoutes = express.Router()

UserRoutes.post('/login', UserController.login)
UserRoutes.post('/register', UserController.register)


export default UserRoutes