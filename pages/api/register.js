// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getCsrfToken } from 'next-auth/react'

import { createUser, userExists } from '../../app/dao/user'

export default async function handler (req, res) {
  if (req.method === 'POST') {
    const csrfToken = await getCsrfToken({ req })
    if (csrfToken !== req.body.csrfToken) {
      res.status(200).json({ message: 'Csrf token does not match!', error: true })
      return
    }

    try {
      const checkEmail = await userExists({
        email: req.body.email
      })

      if (checkEmail) {
        res.status(200).json({ message: 'Email already in use!', error: true })
        return
      }

      await createUser({
        firstName : req.body.firstName,
        lastName  : req.body.lastName,
        password  : req.body.password,
        email     : req.body.email
      })
      res.status(200).json({ message: 'Sucessful registration!', error: false })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Unable to connect to the database!', error: true })
    }
  }
}
