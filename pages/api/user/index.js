// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from 'next-auth/react'
import { fetchUser, updateUser, userExists } from '../../../app/dao/user'

export default async function handler (req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(200).json({ message: 'User is not logged in!', error: true })
    return
  }
  if (req.method === 'GET') {
    try {
      const result = await fetchUser({
        email: session.user.email
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  } else if (req.method === 'PATCH') {
    try {
      if (req.body.email) {
        const checkEmail = await userExists({
          email: req.body.email
        })

        if (checkEmail) {
          res.status(200).json({ message: 'Email already in use!', error: true })
          return
        }
      }

      const result = await updateUser({
        currentEmail : session.user.email,
        firstName    : req.body.firstName,
        lastName     : req.body.lastName,
        email        : req.body.email
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  }
}
