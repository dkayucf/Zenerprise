import * as yup from 'yup'

yup.addMethod(yup.string, 'strongPassword', strongPasswordMethod)

function strongPasswordMethod() {
  return this.test('strongPasswordTest', '', function (value) {
    const { path, createError } = this
    switch (Boolean(value)) {
      case !/^(?=.*[a-z])/.test(value):
        return createError({
          path,
          message: 'Password must include lowercase letter',
        })
      case !/^(?=.*[A-Z])/.test(value):
        return createError({
          path,
          message: 'Password must include uppercase letter',
        })
      case !/^(?=.*[0-9])/.test(value):
        return createError({ path, message: 'Password must include digit' })
      case !/^(?=.*[!@#$%^&*])/.test(value):
        return createError({
          path,
          message: 'Password must include special character',
        })
      default:
        return true
    }
  })
}

export default yup
