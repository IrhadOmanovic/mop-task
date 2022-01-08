import { PrismaClient } from '@prisma/client'

const DBClient = class {
  constructor () {
    this.prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
  }

  getInstance () {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient()
    }
    return DBClient.instance
  }
}

const prismClient = new DBClient()

export default prismClient
