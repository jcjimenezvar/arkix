export interface IDbService {
  getFilteredData(entity: any): Promise<any>
  getData(entity: any): Promise<any>
  setData(entity: any): Promise<any>
}
