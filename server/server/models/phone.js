import mongoose from 'mongoose'

const { Schema } = mongoose
/**
 * Phone Number Schema
 */
const PhoneNumberSchema = new Schema({
  phone: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  primaryPhone: {
    type: Boolean,
    default: true
  },
  phoneData: {
    countryCode: { type: String, required: true },
    dialCode: { type: String, required: true },
    format: { type: String, required: true },
    name: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
})

export default mongoose.model('PhoneNumber', PhoneNumberSchema)
