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
    sendDiscordNotifications: {
      type: Boolean,
      required: true,
      default: false
    },
    notifyIfPriceGoesHigher: {
      type: Boolean,
      required: true,
      default: false
    },
    notifyIfPriceGoesLower: {
      type: Boolean,
      required: true,
      default: false
    },
    notifyIfProductIsOOS: {
      type: Boolean,
      required: true,
      default: false
    },
    discordHookUrl: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    },
  })

export default mongoose.model('User', UserSchema)