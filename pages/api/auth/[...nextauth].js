import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import DBClient from '../../../app/DBClient'
import { compareHashedPasswords } from '../../../lib/hash'
// import axios from 'axios'

const providers = [
  Credentials({
    name      : 'Credentials',
    authorize : async (credentials, req) => {
      const prisma = DBClient.getInstance().prisma

      const user = await prisma.user.findFirst({
        where: {
          email: req.body.email
        }
      })

      if (user) {
        const match = compareHashedPasswords(req.body.password, {
          salt           : user.salt,
          hashedpassword : user.password
        })

        if (!match) {
          return null
        }
      } else {
        return null
      }

      delete user.password
      delete user.salt
      prisma.$disconnect()

      return user
    }
  })
]

const callbacks = {
  // Getting the JWT token from API response
  async jwt ({ token, user, ...props }) {
    // console.log('token', token)
    // console.log('user', user)
    // console.log('props', props)
    user && (token.user = user)
    return token
  },

  async session ({ session, token }) {
    if (token?.user?.id) {
      const prisma = DBClient.getInstance().prisma
      const user = await prisma.user.findFirst({
        where: {
          id: token.user.id
        }
      })
      delete user.password
      delete user.salt
      session.user = user
      prisma.$disconnect()
      return session
    }
    session.user = token.user

    return session
  }
}

const secret = process.env.AUTH_SECRET

const options = {
  providers,
  callbacks,
  secret
}

export default (req, res) => NextAuth(req, res, options)
