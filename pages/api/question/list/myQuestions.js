// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from 'next-auth/react'
import { fetchQuestionsForSignedUser } from '../../../../app/dao/question'

export default async function handler (req, res) {
  if (req.method === 'GET') {
    try {
      if (!req.query.page || !req.query.perPage) {
        res.status(200).json({ message: 'Missing parameters', error: true })
      }

      const session = await getSession({ req })

      if (!session) {
        res.status(200).json({ message: 'User is not logged in', error: true })
        return
      }

      const page = parseInt(req.query.page)
      const perPage = parseInt(req.query.perPage)

      const questions = await fetchQuestionsForSignedUser(page, perPage, session.user.email)

      res.status(200).json(questions)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  }
}
