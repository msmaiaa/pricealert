import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    url: {
      type: String,
      required: true,
      unique: true
    },
    imgUrl: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    store: {
      type: String,
      required: true
    },
    usersWatching: {
      type: [String],
    },
  }, { timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }})

export default mongoose.model('Product', ProductSchema)