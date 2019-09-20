import 'reflect-metadata'

const vars = {  
  nodeEnv: 'NODE_ENV',
  port: 'PORT',
  rootPath: 'ROOT_PATH',
  saltrounds: 10  
}

import { ConfigService } from './configService'

describe('ConfigService', () => {
  const config = new ConfigService()
  const db = ''

  test('getVars devuelve undefined antes de llamar a load', () => {
    const env = config.getVars()
    expect(env).toBeUndefined()
  })

  test('load da error de validación si no estan configuradas las variables requeridas', () => {
    const err = config.load()
    expect(err).toContain('Config validation error:')
  })

  test('load NO da error de validación si estan configuradas las variables requeridas', () => {
    process.env[vars.nodeEnv] = 'testing'
    process.env[vars.rootPath] = 'some-path'    

    const err = config.load()
    expect(err).toBeFalsy()
    expect(config.getVars()).toBeTruthy()
  })

  test('NODE_ENV invalido da error', () => {
    process.env[vars.nodeEnv] = 'invalid-value'

    const err = config.load()
    expect(err).toContain('Config validation error:')
    expect(config.getVars()).toBeFalsy()
  })

  test('NODE_ENV development carga correctamente', () => {
    process.env[vars.nodeEnv] = 'development'

    const err = config.load()
    expect(err).toBeFalsy()
    expect(config.getVars().env).toEqual('development')
    expect(config.getVars().isDev).toBeTruthy()
  })

  test('NODE_ENV testing carga correctamente', () => {
    process.env[vars.nodeEnv] = 'testing'

    const err = config.load()
    expect(err).toBeFalsy()
    expect(config.getVars().env).toEqual('testing')
    expect(config.getVars().isTest).toBeTruthy()
  })

  test('NODE_ENV production carga correctamente', () => {
    process.env[vars.nodeEnv] = 'production'

    const err = config.load()
    expect(err).toBeFalsy()
    expect(config.getVars().env).toEqual('production')
    expect(config.getVars().isProd).toBeTruthy()
  })

  test('PORT defaults to 8080', () => {
    expect(config.getVars().server.port).toEqual(8080)
  })

  test('PORT carga correctamente', () => {
    process.env[vars.port] = '5050'

    const err = config.load()
    expect(err).toBeFalsy()
    expect(config.getVars().server.port).toEqual(5050)
  })

  test('ROOT_PATH carga correctamente', () => {
    process.env[vars.rootPath] = 'some-123-path'
    const err = config.load()
    expect(err).toBeFalsy()
    expect(config.getVars().server.rootPath).toEqual('some-123-path')
  })
})
