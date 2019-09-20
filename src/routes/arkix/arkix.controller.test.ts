import 'reflect-metadata'

import { IConfig } from '@config/vars'
import { createRequest, createResponse } from 'node-mocks-http'
import { ArkixController } from './arkix.controller'

import { IArkixService } from '@services/arkixService'
import { ArkixService } from '@services/arkixService/arkixService'
import { IDbService } from '@services/dbService'
import { DbService } from '~/services/dbService/dbService'

// Crear mock Config
const mockConfigData = {}
class MockConfig implements IConfig {
  public getVars = () => {
    return mockConfigData
  }
}

describe('ArkixController', () => {
  const config = new MockConfig()
  let arkixService: IArkixService
  let dbService: IDbService

  test('ArkixService instancia correctamente', async () => {
    dbService = new DbService()
    arkixService = new ArkixService(config, dbService)
    expect(arkixService).toBeDefined()
  })

  test('PUT putUsers, inserta la informacion correctamente', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      email: 'any-email',
      password: 'any-email',
      username: 'any-user',
    }
    const responseMock = {
      data: {
        email: 'any-email',
        password: 'any-email',
        username: 'any-user',
      },
    }
    arkixService.put = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.put(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'PUT',
      url: `/arkix`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.putUsers(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(200)
    expect(data).toEqual(responseMock)
  })

  test('PUT putUsers, email ya registrado', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      email: 'any-email',
      password: 'any-email',
      username: 'any-user',
    }
    const responseMock = {
      data: '',
      errors: ['Usuario ya registrado']
    }
    arkixService.put = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.put(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'PUT',
      url: `/arkix`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.putUsers(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())    
    expect(res._getStatusCode()).toEqual(409)
    expect(data.data).toEqual(responseMock.data)
  })
  test('PUT putUsers, request invalido', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      password: 'any-email',
      username: 'any-user',
    }
    const responseMock = {
      data: null,
      errors: ['invalid_request'],
    }
    arkixService.put = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.put(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'PUT',
      url: `/arkix`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.putUsers(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(422)
    expect(data).toEqual(responseMock)
  })

  test('PUT putUsers, error 500', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      email: 'any-email',
      password: 'any-email',
      username: 'any-user',
    }
    const responseMock = {
      data: null,
      errors: ['internal_server_error'],
    }
    arkixService.put = jest.fn(() =>
      Promise.reject(new Error('Error forzado para pruebas'))
    )

    let returnedData
    try {
      returnedData = await arkixService.put(requestBody)
    } catch (err) {
      expect(err).toBeDefined()
    }

    const req = createRequest({
      body: requestBody,
      method: 'PUT',
      url: `/arkix`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.putUsers(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(500)    
  })

  test('POST getToken, obtiene el token de autenciacion correctamente', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      username: 'jjimenezv24',
    }
    const responseMock =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpqaW1lbmV6djI0QGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqY2ppbWVuZXp2MjQiLCJpYXQiOjE1Njg5NjgyNTgsImV4cCI6MTU3MjU2ODI1OH0.2kaf6AHb_BqXML0c4ZYXITPSer-0DjLVpfnCkhTx7bc'
    arkixService.auth = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.auth(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'POST',
      url: `/arkix/getToken`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.getToken(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(200)
    expect(data).toEqual(responseMock)
  })

  test('POST getToken, usuario no registrado', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      username: 'jjimenezv24',
    }
    const responseMock = {
      data: '',
      errors: ['Usuario no registrado']
    }
    arkixService.auth = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.auth(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'POST',
      url: `/arkix/getToken`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.getToken(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(409)
    expect(data.data).toEqual(responseMock.data)
  })

  test('POST getToken, invalid request', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      userName: 'jjimenezv24',
    }
    const responseMock ={
      data: null,
      errors: ['invalid_request']
    }
    arkixService.auth = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.auth(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'POST',
      url: `/arkix/getToken`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.getToken(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(422)
    expect(data).toEqual(responseMock)
  })

  test('POST getToken, error 500', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      username: 'jjimenezv24',
    }
    const responseMock ={
      data: null,
      errors: ['internal_server_error']
    }
    arkixService.auth = jest.fn(() => Promise.reject(new Error('Error forzado para pruebas')))

    let returnedData
    try {
      returnedData = await arkixService.auth(requestBody)
    } catch (err) {
      expect(err).toBeDefined()
    }
    const req = createRequest({
      body: requestBody,
      method: 'POST',
      url: `/arkix/getToken`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.getToken(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(500)
  })

  test('POST validateToken, verifica el token de autenciacion y retorna una lista de información', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpqaW1lbmV6djI0QGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqY2ppbWVuZXp2MjQiLCJpYXQiOjE1Njg5NjgyNTgsImV4cCI6MTU3MjU2ODI1OH0.2kaf6AHb_BqXML0c4ZYXITPSer-0DjLVpfnCkhTx7bc',
    }
    const responseMock = {
      data: [
        {
          id: 1,
          number: 2,
        },
      ],
    }

    arkixService.get = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.get(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'POST',
      url: `/arkix`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.getPosts(req, res, next)

    res.end()
    const data = res._getData()
    expect(res._getStatusCode()).toEqual(200)
    expect(data).toEqual(responseMock.data)
  })

  test('POST validateToken, invalid request', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      tokeN:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpqaW1lbmV6djI0QGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqY2ppbWVuZXp2MjQiLCJpYXQiOjE1Njg5NjgyNTgsImV4cCI6MTU3MjU2ODI1OH0.2kaf6AHb_BqXML0c4ZYXITPSer-0DjLVpfnCkhTx7bc',
    }
    const responseMock = {
      data: null,
      errors: ['invalid_request']
    }

    arkixService.get = jest.fn(() => Promise.resolve(responseMock))

    let returnedData
    try {
      returnedData = await arkixService.get(requestBody)
    } catch (err) {
      expect(err).toBeFalsy()
    }

    expect(returnedData).toEqual(responseMock)

    const req = createRequest({
      body: requestBody,
      method: 'POST',
      url: `/arkix`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.getPosts(req, res, next)

    res.end()
    const data = JSON.parse(res._getData())
    expect(res._getStatusCode()).toEqual(422)
    expect(data).toEqual(responseMock)
  })

  test('POST validateToken, error 500', async () => {
    const arkixController = new ArkixController(arkixService)

    const requestBody = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpqaW1lbmV6djI0QGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqY2ppbWVuZXp2MjQiLCJpYXQiOjE1Njg5NjgyNTgsImV4cCI6MTU3MjU2ODI1OH0.2kaf6AHb_BqXML0c4ZYXITPSer-0DjLVpfnCkhTx7bc',
    }
    const responseMock = {
      data: null,
      errors: ['internal_server_error']
    }

    arkixService.get = jest.fn(() => Promise.reject(new Error('Error forzado para pruebas')))

    let returnedData
    try {
      returnedData = await arkixService.get(requestBody)
    } catch (err) {
      expect(err).toBeDefined()
    }
    const req = createRequest({
      body: requestBody,
      method: 'POST',
      url: `/arkix`,
    })

    const res = createResponse()
    const next = () => {
      const a = 1
    }

    await arkixController.getPosts(req, res, next)

    res.end()
    const data = res._getData()
    expect(res._getStatusCode()).toEqual(500)    
  })
})
