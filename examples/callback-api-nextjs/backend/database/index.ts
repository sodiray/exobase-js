import { Database, databaseClient } from './client'

const makeDatabase = (): Database => {
  // In a real database, do connection string or
  // auth or other database setup here
  return databaseClient()
}

export type { Database }
export default makeDatabase
