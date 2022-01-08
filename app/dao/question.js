const { default: DBClient } = require('../DBClient')

module.exports = {
  getLatestQuestions: async (page = 0, perPage = 20) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const results = await prisma.question.findMany({
        skip    : page * perPage,
        take    : perPage,
        orderBy : {
          createdAt: 'desc'
        }
      })

      const tmp = results.map(x => {
        x.createdAt = x.createdAt.toString()
        return x
      })

      return tmp
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  getHotestQuestions: async (page = 0, perPage = 20) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const results = await prisma.question.findMany({
        skip    : page * perPage,
        take    : perPage,
        orderBy : {
          ratings: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { ratings: true }
          }
        },
        where: {
          ratings: {
            some: {
              rating: true
            }
          }
        }
      })

      const tmp = results.map(x => {
        x.createdAt = x.createdAt.toString()
        return x
      })

      return tmp
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  getQuestion: async (id) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const question = await prisma.question.findUnique({
        include: {
          responses: {
            include: {
              author: true
            }
          }

        },
        where: {
          id: id
        }
      })

      question.responses = question.responses.map(response => {
        response.createdAt = response.createdAt.toString()
        response.author.createdAt = response?.author?.createdAt.toString()
        response.author.updatedAt = response?.author?.updatedAt.toString()

        return response
      })

      question.createdAt = question.createdAt.toString()

      return question
    } catch (error) {
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  createQuestion: async ({ title, content, email }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.question.create({
        data: {
          title   : title,
          content : content,
          author  : {
            connect: { email: email }
          }
        }
      })

      result.createdAt = result.createdAt.toString()

      return result
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  fetchQuestionForSignedUser: async ({
    questionId,
    email
  }) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const result = await prisma.question.findUnique({
        where: {
          id: questionId
        },
        include: {
          responses: {
            include: {
              ratings: {
                where: {
                  author: {
                    email: email
                  }
                }
              },
              author: true
            }
          },
          ratings: {
            where: {
              author: {
                email: email
              }
            }
          }
        }

      })

      result.createdAt = result.createdAt.toString()

      result.responses = result.responses.map(response => {
        response.createdAt = response.createdAt.toString()
        return response
      })

      return result
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  },
  fetchQuestionsForSignedUser: async (page = 0, perPage = 20, email) => {
    const prisma = DBClient.getInstance().prisma
    try {
      const results = await prisma.question.findMany({
        skip  : page * perPage,
        take  : perPage,
        where : {
          author: {
            email: email
          }
        },
        include: {
          author: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      const tmp = results.map(question => {
        question.createdAt = question.createdAt.toString()
        question.author.createdAt = question.author.createdAt.toString()
        return question
      })

      return tmp
    } catch (error) {
      console.log(error)
      return { error: 'Unable to connect to the database!' }
    } finally {
      prisma.$disconnect()
    }
  }
}
