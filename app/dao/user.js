const { generateSalt, hash } = require('../../lib/hash')
const { default: DBClient } = require('../DBClient')

module.exports = {
  getMostActiveUsers: async (page = 0, perPage = 20) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const users = await prisma.user.findMany({
        skip    : page * perPage,
        take    : perPage,
        orderBy : {
          responses: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { responses: true }
          }
        }
      })

      const temp = users.map(user => {
        user.createdAt = user.createdAt.toString()
        user.updatedAt = user.updatedAt.toString()
        return user
      })
      //   newResponse.createdAt = newResponse.createdAt.toString()

      return temp
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  createUser: async ({
    firstName,
    lastName,
    password,
    email
  }) => {
    const prisma = DBClient.getInstance().prisma
    const salt = generateSalt(10)
    const hashResult = hash(password, salt)
    try {
      const user = await prisma.user.create({
        data: {
          firstName : firstName,
          lastName  : lastName,
          password  : hashResult.hashedpassword,
          salt      : hashResult.salt,
          email     : email
        }
      })

      user.createdAt = user.createdAt.toString()
      user.updatedAt = user.updatedAt.toString()

      return user
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  userExists: async ({
    email
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const userCount = await prisma.user.count({
        where: {
          email: email
        }
      })

      return userCount === 1
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  fetchUser: async ({
    email,
    returnPassword
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.user.findFirst({
        where: {
          email: email
        }
      })

      if (!result) return null

      result.createdAt = result.createdAt.toString()

      if (returnPassword) {
        return result
      }

      delete result.password
      delete result.salt

      return result
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  updateUser: async ({
    email,
    lastName,
    firstName,
    currentEmail
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const data = {}

      if (email) {
        data.email = email
      }
      if (firstName) {
        data.firstName = firstName
      }

      if (lastName) {
        data.lastName = lastName
      }

      const user = await prisma.user.update({
        where: {
          email: currentEmail
        },
        data: data
      })

      delete user.password
      delete user.salt

      user.createdAt = user.createdAt.toString()
      user.updatedAt = user.updatedAt.toString()

      return user
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  updateUserPassword: async ({
    password,
    email
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const salt = generateSalt(10)
      const hashResult = hash(password, salt)

      const user = await prisma.user.update({
        where: {
          email: email
        },
        data: {
          password : hashResult.hashedpassword,
          salt     : hashResult.salt
        }
      })

      user.createdAt = user.createdAt.toString()
      user.updatedAt = user.updatedAt.toString()

      delete user.password
      delete user.hash

      return user
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  fetchUserById: async ({
    id
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.user.findFirst({
        where: {
          id: id
        }
      })

      result.createdAt = result.createdAt.toString()

      delete result.password
      delete result.salt

      return result
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  }

}
