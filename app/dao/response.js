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
    } finally {
      prisma.$disconnect()
    }
  }
}
