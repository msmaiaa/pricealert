import mongoose from 'mongoose'

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }]
  })
)

export default User