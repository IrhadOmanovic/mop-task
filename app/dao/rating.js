const { default: DBClient } = require('../DBClient')

module.exports = {
  fetchQuestionRating: async ({
    questionId,
    email
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const ratingResult = await prisma.rating.findFirst({
        where: {
          questionId : questionId,
          author     : {
            email: email
          }
        }
      })
      return ratingResult
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  updateRating: async ({
    ratingId,
    rating
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.rating.update({
        where: {
          id: ratingId
        },
        data: {
          rating: rating
        }
      })

      return result
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  createQuestionRating: async ({
    questionId,
    email,
    rating
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.rating.create({
        data: {
          rating : rating,
          author : {
            connect: { email: email }
          },
          question: {
            connect: { id: questionId }
          }
        }
      })

      // result.createdAt = result.createdAt.toString()

      return result
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  createResponseRating: async ({
    responseId,
    email,
    rating
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.rating.create({
        data: {
          rating : rating,
          author : {
            connect: { email: email }
          },
          response: {
            connect: { id: responseId }
          }
        }
      })

      // result.createdAt = result.createdAt.toString()

      return result
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  }
}
