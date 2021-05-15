import Joi from 'joi'

export default {
  // POST /api/users/validate-user
  validateUser: {
    body: {
      email: Joi.string().email(),
      phone: Joi.string()
    }
  },

  // POST /api/users/register
  registerUser: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      phone: Joi.string().required(),
      phoneFormatted: Joi.string().required(),
      phoneData: {
        countryCode: Joi.string().required(),
        dialCode: Joi.string().required(),
        format: Joi.string().required(),
        name: Joi.string().required()
      },
      password: Joi.string().required()
    }
  },

  // POST /api/users/login
  login: {
    body: {
      user: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/users/login
  forgotPassword: {
    body: {
      email: Joi.string()
        .email()
        .required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      // phoneNo: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string()
        .hex()
        .required()
    }
  }
}
