import { IConfig } from '@config/vars'
import { IDbService } from '@services/dbService'
import axios from 'axios'
import bcrypt from 'bcrypt'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import jsonwebtoken from 'jsonwebtoken'
import { IArkixService } from '.'
import { TYPES } from '../../config/ioc/types'

@provide(TYPES.IArkixService)
export class ArkixService implements IArkixService {
  constructor(
    @inject(TYPES.IConfig) private config: IConfig,
    @inject(TYPES.IDbService) private dbService: IDbService
  ) {}

  public put = async (payload: any) => {
    const saltrounds = this.config.getVars().saltrounds
    let emailAuxKey = ''
    let emailAuxValue = ''
    Object.keys(payload).map(e => {
      if (e === 'email') {
        emailAuxKey = e
        emailAuxValue = payload[e]
      }
    })
    const entity = {
      key: emailAuxKey,
      kind: 'Arkix',
      value: emailAuxValue,
    }
    let response: any = {
      data: '',
      errors: [],
    }
    let result
    // Valido si el correo enviado ya se encuentra resgistrado, en caso de que si retorno mensaje error
    try {
      result = await this.dbService.getFilteredData(entity)
      if (result) {
        response = {
          data: '',
          errors: [`El usuario con email ${payload.email} ya esta registrado`],
        }
        return response
      }
    } catch (error) {
      throw new Error(`Error en DbService ${error}`)
    }

    // Encripto la contraseña enviada antes de insertar la información en la base de datos
    let hashPassword
    try {
      hashPassword = await bcrypt.hash(payload.password, saltrounds)
    } catch (error) {
      throw new Error(`Error creando el hash ${error}`)
    }
    payload.password = hashPassword

    // Si el email no existe inserto la información enviada en la BD
    const entityAux = {
      data: payload,
      kind: 'Arkix',
    }
    const responseDatastore: any = await this.dbService.setData(entityAux)
    if (responseDatastore) {
      response = {
        data: payload,
      }
    }
    return response
  }
  public auth = async (payload: any) => {
    const [keyAux] = Object.keys(payload)
    const [valueAux] = Object.values(payload)
    const entity = {
      key: keyAux,
      kind: 'Arkix',
      value: valueAux,
    }
    let response: any = {
      data: '',
      errors: [],
    }

    let result
    // Valido si el usuario enviado existe, en caso de que no retorno mensaje error
    try {
      result = await this.dbService.getFilteredData(entity)
      if (!result) {
        response = {
          data: '',
          errors: [`El usuario ${entity.value} no esta registrado`],
        }
        return response
      }
    } catch (error) {
      throw new Error(`Error en DbService ${error}`)
    }
    // Si el usuario existe creo el token
    return await this.createTkn(result)
  }
  public get = async (payload: any) => {
    let response: any = {
      data: '',
      errors: [],
    }
    const result = this.validateJwt(payload.token)
    if (!result) {
      response = {
        data: '',
        errors: ['Token invalido'],
      }
      return response
    }
    // Si el usuario esta autenticado hago la peticion a la URL para acceder a los valores recibidos
    const jsonplaceholder = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    response = {
      data: jsonplaceholder.data,
    }

    return response
  }

  private createTkn = async (payload: any) => {
    const tokenData = {
      email: payload.email,
      username: payload.username,
    }
    let token
    try {
      token = jsonwebtoken.sign(tokenData, 'Arkix', {
        expiresIn: 60 * 60 * 1000, // expira in 1 hora
      })
    } catch (error) {
      throw new Error(`Error creando el token ${error}`)
    }
    return token
  }

  private validateJwt = async (token: any) => {
    let isValid: boolean = false
    const tokenAux = token.replace('Bearer ', '')
    const result = jsonwebtoken.verify(tokenAux, 'Arkix')
    if (result) {
      isValid = true
    }
    return isValid
  }
}
