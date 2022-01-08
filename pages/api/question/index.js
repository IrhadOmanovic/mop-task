import { getCsrfToken, getSession } from 'next-auth/react'

import { createQuestion, fetchQuestionForSignedUser } from '../../../app/dao/question'

export default async function handler (req, res) {
  if (req.method === 'POST') {
    const csrfToken = await getCsrfToken({ req })

    if (csrfToken !== req.body.csrfToken) {
      res.status(200).json({ message: 'Csrf token does not match!', error: true })
      return
    }

    const session = await getSession({ req })

    try {
      const newQuestion = await createQuestion({
        title   : req.body.title,
        content : req.body.content,
        email   : session.user.email
      })

      res.status(200).json(newQuestion)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  } else if (req.method === 'GET') {
    const session = await getSession({ req })

    if (!session) {
      res.status(200).json({ message: 'User is not logged in', error: true })
      return
    }

    try {
      const questionId = parseInt(req.query.questionId)
      const result = await fetchQuestionForSignedUser({
        questionId : questionId,
        email      : session.user.email
      })

      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  }
}
