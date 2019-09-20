import * as express from 'express'
import { inject } from 'inversify'
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
  next,
  request,
  requestParam,
  response,
} from 'inversify-express-utils'
import joi from 'joi'
import { TYPES } from '../../config/ioc/types'
import { IArkixService } from '../../services/arkixService'
import {
  getRequestSchema,
  postRequestSchema,
  putRequestSchema,
} from './arkix.model'

@controller('')
export class ArkixController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IArkixService)
    private arkisService: IArkixService
  ) {}

  @httpPut('')
  public async putUsers(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {    
    const data = req.body
    const validationResult = joi.validate(data, putRequestSchema)
    if (validationResult.error) {
      // Si la validación de los datos de la solicitud falla, entonces retorna error 422 / Invalid Request
      const httpResponse = {
        data: null,
        errors: ['invalid_request'],
      }
      res.status(422).json(httpResponse)
      nextFunc()
    } else {
      let ok = true
      try {
        const serviceResponse = await this.arkisService.put(data)
        const httpResponse = {
          data: serviceResponse.data,
        }        
        if (serviceResponse.data === '') {
          res.json(httpResponse)
          res.status(409)
          nextFunc()
          return
        }

        res.json(httpResponse)
        res.status(200)
        nextFunc()
      } catch (err) {
        ok = false
        const httpResponse = {
          data: null,
          errors: ['internal_server_error'],
        }
        res.status(500).json(httpResponse)
        nextFunc()
      }
    }
  }

  @httpPost('/getToken')
  public async getToken(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    const data = req.body
    const validationResult = joi.validate(data, getRequestSchema)
    if (validationResult.error) {
      // Si la validación de los datos de la solicitud falla, entonces retorna error 422 / Invalid Request
      const httpResponse = {
        data: null,
        errors: ['invalid_request'],
      }
      res.status(422).json(httpResponse)
      nextFunc()
    } else {
      try {
        const serviceResponse = await this.arkisService.auth(data)
        const httpResponse = serviceResponse       
        if (serviceResponse.data === '') {
          res.json(httpResponse)
          res.status(409)
          nextFunc()
          return
        }
        res.json(httpResponse)
        res.status(200)
        nextFunc()
      } catch (err) {
        const httpResponse = {
          data: null,
          errors: ['internal_server_error'],
        }
        res.status(500).json(httpResponse)
        nextFunc()
      }
    }
  }

  @httpPost('')
  public async getPosts(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    const data = req.body
    const validationResult = joi.validate(data, postRequestSchema)
    if (validationResult.error) {
      // Si la validación de los datos de la solicitud falla, entonces retorna error 422 / Invalid Request
      const httpResponse = {
        data: null,
        errors: ['invalid_request'],
      }
      res.status(422).json(httpResponse)
      nextFunc()
    } else {
      try {
        const serviceResponse = await this.arkisService.get(data)
        const httpResponse = serviceResponse.data
        res.send(httpResponse)
        res.status(200)
        nextFunc()
      } catch (err) {
        const httpResponse = {
          data: null,
          errors: ['internal_server_error'],
        }
        res.status(500).json(httpResponse)
        nextFunc()
      }
    }
  }
}
