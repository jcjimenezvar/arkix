// tslint:disable-next-line: no-var-requires
require('module-alias/register')

// Permitir cargar variables de entorno desde .env para ambientes de development o testing
import dotenv = require('dotenv')

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}




// Importar Reflect antes que Inversify
import 'reflect-metadata'

// Inicializar configuracion desde ambiente
import { ConfigService } from './config/vars/configService'
const configs = new ConfigService()
const configErr = configs.load()
if (configErr) throw new Error(configErr)

// Importar dependencias de Express y de Inversify
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import { InversifyExpressServer } from 'inversify-express-utils'
import { createLightship } from 'lightship'
import { container } from './config/ioc/inversify.config'

import { TYPES } from './config/ioc/types'

// Obtener variables de configuración desde entorno
const httpPort = configs.getVars().server.port
const httpRootPath = configs.getVars().server.rootPath

// Cargar las entidades inyectables
// la anotación @provide() las registra automaticamente
import './config/ioc/loader'

// registrar instancia de config en container de dependencias
container.bind<any>(TYPES.IConfig).toConstantValue(configs)

// Configurar wrap de Express con Inversify para proveer inversión de control e inyección de dependencias
const server = new InversifyExpressServer(container, null, {
  rootPath: httpRootPath,
})

server.setConfig(expressApp => {
  expressApp.use(bodyParser.json())
  expressApp.use(helmet())
  expressApp.use(cors())
})
const app = server.build()

// Configurar Swagger-UI en ambientes de development y testing
import swaggerUiExpress from 'swagger-ui-express'
import apiDocsJson from './api-docs.json'

if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/api-docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(apiDocsJson)
  )
}

// Configuración del framework para health checks (readiness/ liveness checks & graceful shutdown )
const lightship = createLightship({ port: 9000 })

lightship.registerShutdownHandler(() => {
  httpServer.close()
})

// Iniciar el servidor HTTP
const httpServer = app.listen(httpPort, () => {
  // tslint:disable-next-line: no-console
  console.log(`HTTP server started at http://localhost:${httpPort}`)

  // agrego un tiempo de 10 segundos de warm up para enviar señal de readyness y recibir tráfico
  setTimeout(() => {
    lightship.signalReady()
  }, 10000)
})

exports = module.exports = app
