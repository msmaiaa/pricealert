import mongoose from 'mongoose'

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    url: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })
)

export default Product