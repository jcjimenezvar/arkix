import * as CredentialsDatastore from '../../arkix-253504-10d093c75515.json'

import { TYPES } from '@config/ioc/types'
import { Datastore } from '@google-cloud/datastore'
import { provide } from 'inversify-binding-decorators'
import { IDbService } from '.'

@provide(TYPES.IDbService)
export class DbService implements IDbService {
  public datastore: Datastore

  constructor() {
    this.datastore = new Datastore({
      credentials: CredentialsDatastore,
      projectId: 'arkix-253504',
    })
  }

  public getFilteredData = async (entity: any) => {
    try {
      const query = this.datastore
        .createQuery(entity.kind)
        .filter(entity.key, '=', entity.value)

      const [responseDatastore] = await this.datastore.runQuery(query)      
      return responseDatastore.length === 0 ? null : responseDatastore[0]
    } catch (error) {
      throw new Error(`Error consultando la información ${error}`)
    }
  }

  public getData = async (entity: any) => {
    try {
      const query = this.datastore.createQuery(entity.kind)

      const [responseDatastore] = await this.datastore.runQuery(query)
      return responseDatastore.length === 0 ? null : responseDatastore[0]
    } catch (error) {
      throw new Error(`Error consultando la información ${error}`)
    }
  }

  public setData = async (entity: any) => {
    const taskKey = this.datastore.key(entity.kind)
    const row = {
      data: entity.data,
      key: taskKey,
    }
    try {
      const responseDatastore: any = await this.datastore.save(row)
      const datastoreID = responseDatastore[0].mutationResults[0].key.path[0].id
      return datastoreID ? datastoreID : null
    } catch (error) {
      throw new Error(`Error insertando la información, ${error}`)
    }
  }
}
