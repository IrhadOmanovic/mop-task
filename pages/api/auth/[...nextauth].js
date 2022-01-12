import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { fetchUser, fetchUserById } from '../../../app/dao/user'
import { compareHashedPasswords } from '../../../lib/hash'
// import axios from 'axios'

const providers = [
  Credentials({
    name        : 'Credentials',
    credentials : {
      username : { label: 'Username', type: 'text' },
      password : { label: 'Password', type: 'password' }
    },
    authorize: async (credentials, req) => {
      let user
      try {
        user = await fetchUser({
          email          : credentials.email,
          returnPassword : true
        })
      } catch (error) {
        return null
      }

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

      return user
    }
  })
]

const callbacks = {
  // Getting the JWT token from API response
  async jwt ({ token, user, ...props }) {
    user && (token.user = user)
    return token
  },

  async session ({ session, token }) {
    if (token?.user?.email) {
      const user = await fetchUserById({
        id: token.user.id
      })
      session.user = user
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
