import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import UserController from '../controllers/UserController'
import AuthenticationService from '../services/AuthenticationService'

const UserRoutes = express.Router()

UserRoutes.post('/login', UserController.login)
UserRoutes.post('/register', UserController.register)
UserRoutes.put('/update', AuthenticationService.verifyJWT, UserController.update)


export default UserRoutes