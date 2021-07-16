import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/',(req, res)=>{
  res.status(200).send({message: 'Hello world!'})
})

export default app
