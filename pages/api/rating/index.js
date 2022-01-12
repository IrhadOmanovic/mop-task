// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getCsrfToken, getSession } from 'next-auth/react'
import { createRating, deleteRating, updateRating } from '../../../app/dao/rating'

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

  try {
    if (req.method === 'POST') {
      const response = await createRating({
        responseId : req.body.responseId,
        email      : session.user.email,
        rating     : req.body.rating,
        questionId : req.body.questionId
      })

      res.status(200).json(response)
    } else if (req.method === 'PATCH') {
      const response = await updateRating({
        ratingId : req.body.ratingId,
        rating   : req.body.rating
      })

      res.status(200).json(response)
    } else if (req.method === 'DELETE') {
      const result = await deleteRating({
        ratingId: req.body.ratingId
      })

      res.status(200).json(result)
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to connect to the database!' })
  }
}
