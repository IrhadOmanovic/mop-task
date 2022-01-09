// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getCsrfToken, getSession } from 'next-auth/react'
import { updateUserPassword } from '../../../../app/dao/user'

export default async function handler (req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(200).json({ message: 'User is not logged in!', error: true })
    return
  }

  const csrfToken = await getCsrfToken({ req })
  if (csrfToken !== req.body.csrfToken) {
    res.status(200).json({ message: 'Csrf token does not match!', error: true })
    return
  }

  if (req.method === 'PATCH') {
    try {
      const result = await updateUserPassword({
        email    : session.user.email,
        password : req.body.password
      })

      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  }
}
