import Joi from 'joi'

export default {
  // POST /apix/users/name
  updateName: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required()
    }
  },

  // POST /apix/users/address
  updateAddress: {
    body: {
      country: {
        code: Joi.string().required(),
        label: Joi.string().required()
      },
      addressLineOne: Joi.string().required(),
      addressLineTwo: Joi.string().empty('').default(''),
      city: Joi.string().required(),
      state: {
        value: Joi.string().required(),
        label: Joi.string().required()
      },
      postalCode: Joi.string().required(),
    }
  },

  updateEmail: {
    body: {
      email: Joi.string().required()
    }
  },

  updatePrimaryPhone: {
    body: {
      type: Joi.string().required(),
      primaryPhone: Joi.boolean().isRequired(),
      phone: Joi.string().required(),
      phoneFormatted: Joi.string().required(),
      phoneData: {
        countryCode: Joi.string().required(),
        dialCode: Joi.string().required(),
        format: Joi.string().required(),
        name: Joi.string().required(),
      },
    }
  }

}
