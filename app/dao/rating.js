const { default: DBClient } = require('../DBClient')

module.exports = {
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
    } finally {
      prisma.$disconnect()
    }
  },
  createRating: async ({
    responseId,
    email,
    rating,
    questionId
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const data = {
        rating : rating,
        author : {
          connect: { email: email }
        }
      }

      if (questionId) {
        data.question = {
          connect: { id: questionId }
        }
      }

      if (responseId) {
        data.response = {
          connect: { id: responseId }
        }
      }

      const result = await prisma.rating.create({
        data: data
      })

      // result.createdAt = result.createdAt.toString()

      return result
    } finally {
      prisma.$disconnect()
    }
  },
  deleteRating: async ({
    ratingId
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.rating.delete({
        where: {
          id: ratingId
        }
      })

      return result
    } finally {
      prisma.$disconnect()
    }
  }
}
