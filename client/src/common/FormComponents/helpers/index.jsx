import { compose, split, chain, assocPath, replace, map } from 'ramda'

export const fullValidatorForSchema = (schema, options) => (values) =>
  schema
    .validate(values, {
      abortEarly: false,
      strict: false,
      ...options,
    })
    .then(() => ({}))
    .catch(({ inner }) =>
      inner.reduce((memo, { path, message }) => {
        const parseNumber = (string) => {
          if (Number.isNaN(parseInt(string))) {
            return replace('.', '', string)
          } else {
            return parseInt(string)
          }
        }

        const newPath = compose(
          map(parseNumber),
          chain(split(']')),
          split('[')
        )(path)

        const errorObj = assocPath(
          newPath,
          (memo[path] || []).concat(message),
          {}
        )

        return {
          ...memo,
          ...errorObj,
        }
      }, {})
    )
