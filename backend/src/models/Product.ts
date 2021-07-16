import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    url: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })

export default mongoose.model('Product', ProductSchema)