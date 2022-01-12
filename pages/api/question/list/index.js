// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getLatestQuestions } from '../../../../app/dao/question'

export default async function handler (req, res) {
  if (req.method === 'GET') {
    try {
      if (!req.query.page || !req.query.perPage) {
        res.status(200).json({ message: 'Missing parameters', error: true })
      }

      const page = parseInt(req.query.page)
      const perPage = parseInt(req.query.perPage)

      const questions = await getLatestQuestions(page, perPage)

      res.status(200).json(questions)
    } catch (error) {
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  }
}
