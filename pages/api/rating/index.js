// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getCsrfToken, getSession } from 'next-auth/react'
import { createQuestionRating, updateRating } from '../../../app/dao/rating'

export default async function handler (req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(200).json({ message: 'User is not logged in!', error: true })
    return
  }

  if (req.method === 'PUT') {
    const csrfToken = await getCsrfToken({ req })
    if (csrfToken !== req.body.csrfToken) {
      res.status(200).json({ message: 'Csrf token does not match!', error: true })
      return
    }
    try {
      let result
      if (!req.body.ratingId) {
        result = await createQuestionRating({
          questionId : req.body.questionId,
          rating     : req.body.rating,
          email      : session.user.email
        })
      } else {
        result = await updateRating({
          ratingId : req.body.ratingId,
          rating   : req.body.rating
        })
      }

      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  }
}
