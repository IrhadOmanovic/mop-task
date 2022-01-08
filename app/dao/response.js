const { default: DBClient } = require('../DBClient')

module.exports = {
  postResponse: async ({ content, email, questionId }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const newResponse = await prisma.response.create({
        data: {
          content : content,
          author  : {
            connect: { email: email }
          },
          question: {
            connect: { id: questionId }
          }
        },
        include: {
          author: true
        }
      })
      newResponse.createdAt = newResponse.createdAt.toString()

      return newResponse
    } catch (error) {
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  deleteResponse: async ({ responseId }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const deleteResult = await prisma.response.delete({
        where: {
          id: responseId
        }
      })

      return { deleteResult }
    } catch (error) {
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  updateContentResponse: async ({ responseId, content }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const updatedResult = await prisma.response.update({
        where: {
          id: responseId
        },
        data: {
          content: content
        },
        include: {
          author: true
        }
      })

      updatedResult.createdAt = updatedResult.createdAt.toString()

      return updatedResult
    } catch (error) {
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  }
}
