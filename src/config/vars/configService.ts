// Validaciones de variables de entorno de configuración del microservicio.
import joi from 'joi'

import { IConfig } from '.'

export class ConfigService implements IConfig {
  private vars: any

  constructor() {
    this.vars = undefined
  }

  /**
   * Retorna las variables de ambientes cargadas
   * @returns {any} Objeto con variables de ambiente
   */
  public getVars = () => {
    return this.vars
  }

  /**
   * Lee las variables de ambientes, valida su contenido y las carga en servicio de configuracion.
   *
   * @returns {string} Error - En caseo de ocurrir errores de validación, devuelve un mensaje de error, caso contrario retorna null.
   */
  public load = () => {
    const envVarsSchema = joi
      .object({
        NODE_ENV: joi
          .string()
          .valid('development', 'testing', 'production')
          .required(),
        // HTTP Server
        PORT: joi.number().default(8080),
        ROOT_PATH: joi.string().required(),

        // SALTROUNDS
        SALTROUNDS: joi.number().required(),
      })
      .unknown()
      .required()

    const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
    if (error) {
      this.vars = undefined
      return `Config validation error: ${error.message}`
    }
    this.vars = {
      env: envVars.NODE_ENV,
      isDev: envVars.NODE_ENV === 'development',
      isProd: envVars.NODE_ENV === 'production',
      isTest: envVars.NODE_ENV === 'testing',

      saltrounds: envVars.SALTROUNDS,
      server: {
        port: Number(envVars.PORT),
        rootPath: envVars.ROOT_PATH,
      },
    }
    return null
  }
}
