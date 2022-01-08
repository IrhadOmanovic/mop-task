// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import DBClient from '../../app/DBClient'

export default async function handler (req, res) {
  const prism = DBClient.getInstance().prisma

  try {
    const users = await prism.user.count({
      where: {}
    })
    res.status(200)
    res.json(users)
  } catch (error) {
    res.status(500)
    res.json({ error: 'Unable to connect to the database!' })
  } finally {
    prism.$disconnect()
  }
}
