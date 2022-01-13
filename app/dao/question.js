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
    } finally {
      prisma.$disconnect()
    }
  },
  getHotestQuestions: async (page = 0, perPage = 20) => {
    const prisma = DBClient.getInstance().prisma
    try {
      // Ovaj query bi bio idealan još samo da se može u selectu navesti i čitav question, tj da se može u select staviti i question
      // Drugo šta se može uraditi jeste da koristimo include, međutim, ako koristimo group by onda ne možemo koristiti include
      // Tako da sam morao prvo da dohvatim id pitanja sa najviše pozitivnih recenzija, a zatim da dohvatim pitanja sa tim id-evima
      // i potom da ih sortiram po broju pozitivnih recenzija
      const questionsIdsSorted = await prisma.rating.groupBy({
        by    : ['questionId'],
        where : {
          rating : true,
          NOT    : [{ questionId: null }]
        },
        _count: {
          rating: true
        },
        orderBy: {
          _count: {
            rating: 'desc'
          }
        },
        take: 20
      })

      const tempArray = questionsIdsSorted.map(element => element.questionId)

      // Problem koji se javio ovdje jeste što nisam u mogućnosti da sortiram rezultate dobijene iz sljedeće funkcije
      // Sortiranje je trebalo da bude izvršeno po count ratinga iz selecta, međutim ako se uradi order by count ratings
      // On će vršiti prebrojavanje po svim ocjenama a ne samo onim koje su pozitivne

      // Problem je što se ne može ni specifirati uslov za count -> tipa prebroji samo one responses koji imaju response === true
      const results = await prisma.question.findMany({
        where: {
          id: {
            in: tempArray
          }
        },
        select: {
          id        : true,
          title     : true,
          content   : true,
          createdAt : true,
          // author    : true,
          authorId  : true,
          // responses : true,
          ratings   : {
            where: {
              rating: true
            }
          }

        }
      })

      results.sort((first, second) => {
        if (first.ratings.length > second.ratings.length) {
          return -1
        } else {
          return 1
        }
      })

      const filteredResult = results.map(x => {
        x.createdAt = x.createdAt.toString()
        return x
      })

      return filteredResult
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
    } finally {
      prisma.$disconnect()
    }
  },
  fetchQuestionForSignedUser: async ({
    questionId
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
              ratings : true,
              author  : true
            }
          },
          ratings: true
        }
      })

      result.createdAt = result.createdAt.toString()

      result.responses = result.responses.map(response => {
        response.createdAt = response.createdAt.toString()
        return response
      })

      return result
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
    } finally {
      prisma.$disconnect()
    }
  }
}
