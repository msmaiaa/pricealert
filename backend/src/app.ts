import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import ProductRoutes from './routes/ProductRoutes'
import User from './routes/UserRoutes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/products', ProductRoutes)
app.use('/auth/user', User)

export default app
