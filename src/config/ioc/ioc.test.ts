import 'reflect-metadata'

import '@config/ioc/loader'
import { container } from './inversify.config'

describe('ioc', () => {
  test('Container de control debe estar definido', () => {
    expect(container).toBeTruthy()
  })
})
