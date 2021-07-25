import dotenv from 'dotenv'
dotenv.config()
import app from './app'
import mongoose from 'mongoose'
import ScrapingService from './services/ScrapingService'

mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Connected to the database')
  app.listen(process.env.PORT || 5000, () => {
    console.log('App listening')
  })
  if(process.env.START_SCRAPING === 'TRUE') ScrapingService.startInfiniteScraping()
})