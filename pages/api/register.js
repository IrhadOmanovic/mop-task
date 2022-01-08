// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getCsrfToken } from 'next-auth/react'

import DBClient from '../../app/DBClient'
import { generateSalt, hash } from '../../lib/hash'
import { createUser, userExists } from '../../app/dao/user'

export default async function handler (req, res) {
  if (req.method === 'POST') {
    const prism = DBClient.getInstance().prisma

    const csrfToken = await getCsrfToken({ req })

    if (csrfToken === req.body.csrfToken) {
      const salt = generateSalt(10)
      try {
        const userExist = await userExists({
          email: req.body.email
        })
        if (!userExist) {
          const hashResult = hash(req.body.password, salt)
          await createUser(
            {
              firstName : req.body.firstName,
              lastName  : req.body.lastName,
              password  : hashResult.hashedpassword,
              salt      : hashResult.salt,
              email     : req.body.email
            }
          )
          res.status(200).json({ message: 'Sucessful registration!', error: false, test: hashResult })
        } else {
          res.status(200).json({ message: 'Email in use!', error: true })
        }
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to connect to the database!', error: true, test: error })
      } finally {
        await prism.$disconnect()
      }
    } else {
      res.status(200).json({ message: 'CSRF tokens do not match!', error: true })
    }
  }
}
