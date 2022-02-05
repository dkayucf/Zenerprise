import Joi from 'joi'

Joi.objectId = require('joi-objectid')(Joi)

export default {
  // POST /apix/users/validate-user
  validateUser: {
    body: Joi.object({
      email: Joi.string().email(),
      phone: Joi.string()
    }).options({ stripUnknown: true })
  },
  // POST /apix/users/name
  updateName: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required()
    }).options({ stripUnknown: true })
  },

  // POST /apix/users/address
  updateAddress: {
    body: Joi.object({
      country: {
        code: Joi.string().required(),
        label: Joi.string().required()
      },
      addressLineOne: Joi.string().required(),
      addressLineTwo: Joi.string()
        .empty('')
        .default(''),
      city: Joi.string().required(),
      state: {
        value: Joi.string().required(),
        label: Joi.string().required()
      },
      postalCode: Joi.string().required()
    }).options({ stripUnknown: true })
  },

  // PUT /apix/users/email
  updateEmail: {
    body: {
      emails: Joi.array()
        .min(1)
        .items(
          Joi.object({
            _id: Joi.string().required(),
            email: Joi.string()
              .email()
              .required()
          })
        )
        .has(
          Joi.object({
            _id: Joi.string(),
            email: Joi.string().email()
          })
        )
        .options({ stripUnknown: true })
    }
  },

  // POST /apix/users/email
  addEmail: {
    body: {
      emails: Joi.array()
        .min(1)
        .max(1)
        .items(
          Joi.object({
            email: Joi.string()
              .email()
              .required(),
            primaryEmail: Joi.boolean().required()
          })
        )
        .has(
          Joi.object({
            email: Joi.string()
              .email()
              .required(),
            primaryEmail: Joi.boolean().required()
          })
        )
        .options({ stripUnknown: true })
    }
  },

  updatePassword: {
    body: {
      oldPassword: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  updatePrimaryPhone: {
    body: {
      _id: Joi.objectId(),
      type: Joi.string().required(),
      primaryPhone: Joi.boolean().required(),
      phone: Joi.string().required(),
      phoneFormatted: Joi.string().required(),
      phoneData: {
        countryCode: Joi.string().required(),
        dialCode: Joi.string().required(),
        format: Joi.string().required(),
        name: Joi.string().required()
      }
    }
  }
}
