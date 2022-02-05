import Promise from 'bluebird'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { APIError } from '../helpers/'

const { Schema } = mongoose

/**
 * Phone Number Schema
 */
const PhoneNumberSchema = new Schema(
  {
    phone: {
      type: String,
      required: [true, 'User must have a phone number'],
      index: true,
      unique: true
    },
    phoneFormatted: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['mobile', 'home', 'work'],
      default: 'mobile',
      required: true
    },
    primaryPhone: {
      type: Boolean,
      default: true
    },
    phoneData: {
      countryCode: { type: String, required: true },
      dialCode: { type: String, required: true },
      format: { type: String, required: true },
      name: { type: String, required: true }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

const CountrySchema = new Schema({
  code: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const StatesSchema = new Schema({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

/**
 * Address Number Schema
 */
const AddressSchema = new Schema(
  {
    country: CountrySchema,
    addressLineOne: {
      type: String,
      required: true
    },
    addressLineTwo: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: StatesSchema,
    postalCode: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

/**
 * Email Schema
 */
const EmailSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'User must have a username'],
      unique: true
    },
    primaryEmail: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

/**
 * User Schema
 */
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phoneNumbers: [PhoneNumberSchema],
    addresses: [AddressSchema],
    emails: [EmailSchema],
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: [
        'employee',
        'assistantManager',
        'manager',
        'owner',
        'president',
        'vicePresident',
        'ceo',
        'cfo',
        'humanResources'
      ],
      default: 'owner', //TODO: CHANGE TO EMPLOYEE
      required: true
    },
    resetToken: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// eslint-disable-next-line
UserSchema.pre('save', function userSchemaPre(next) {
  const user = this
  if (this.isModified('password') || this.isNew) {
    // eslint-disable-next-line
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      // eslint-disable-next-line
      bcrypt.hash(user.password, salt, (hashErr, hash) => {
        if (hashErr) {
          return next(hashErr)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

/**
 * Methods
 */

UserSchema.method({})

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync()
      .then(user => {
        if (user) {
          return user
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .execAsync()
  }
}

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema)
