import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    password: String,
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }],
    created: {
      type: Date,
      default: Date.now
    }
  })

export default mongoose.model('User', UserSchema)