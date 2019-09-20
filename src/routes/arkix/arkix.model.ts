import joi from 'joi'

export const putRequestSchema = joi
  .object()
  .keys({
      email: joi.string().required(),
      password: joi.string().required(),
      username: joi.string().required()
  })
  .required()


  export const getRequestSchema = joi
  .object()
  .keys({      
      username: joi.string().required()
  })
  .required()

  export const postRequestSchema = joi
  .object()
  .keys({      
      token: joi.string().required()
  })
  .required()