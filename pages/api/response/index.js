// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getCsrfToken, getSession } from 'next-auth/react'
import { deleteResponse, postResponse, updateContentResponse } from '../../../app/dao/response'

export default async function handler (req, res) {
  const csrfToken = await getCsrfToken({ req })
  if (csrfToken !== req.body.csrfToken) {
    res.status(200).json({ message: 'Csrf token does not match!', error: true })
    return
  }

  const session = await getSession({ req })
  if (!session) {
    res.status(200).json({ message: 'User is not logged in!', error: true })
    return
  }

  if (req.method === 'POST') {
    try {
      const newResponse = await postResponse({
        content    : req.body.content,
        email      : session.user.email,
        questionId : req.body.questionId
      })

      res.status(200).json(newResponse)
    } catch (error) {
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedResult = await deleteResponse({
        responseId: req.body.responseId
      })

      res.status(200).json(deletedResult)
    } catch (error) {
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  } else if (req.method === 'PATCH') {
    try {
      const newResponse = await updateContentResponse({
        content    : req.body.content,
        responseId : req.body.responseId
      })

      res.status(200).json(newResponse)
    } catch (error) {
      res.status(500).json({ error: 'Unable to connect to the database!' })
    }
  }
}
