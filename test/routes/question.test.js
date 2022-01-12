import * as moduleApi from 'next-auth/react'
import { createMocks } from 'node-mocks-http'

import handler from '../../pages/api/question'

const moduleDaoQuestion = require('../../app/dao/question')

jest.mock('next-auth/react')
jest.mock('../../app/dao/question')
jest.mock('@prisma/client')

describe('question', () => {
  let csrfToken
  let errorCsrfToken
  let errorUserNotLoggedIn
  let validObject
  let errorObject
  let errorWithDatabase
  let questionId
  beforeEach(() => {
    moduleApi.getCsrfToken = jest.fn().mockReturnValue(csrfToken)
    csrfToken = 'testToken'
    errorCsrfToken = { error: true, message: 'Csrf token does not match!' }
    errorUserNotLoggedIn = { error: true, message: 'User is not logged in' }
    validObject = { test: 'valid' }
    errorObject = new Error()
    errorWithDatabase = { error: 'Unable to connect to the database!' }
    questionId = '1'
  })

  test('token doesnt match in POST', async () => {
    const { req, res } = createMocks({
      method : 'POST',
      body   : {
        csrfToken: 'notToken'
      }
    })
    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(errorCsrfToken)
    )
  })
  test('user not logged  GET', async () => {
    const { req, res } = createMocks({
      method : 'GET',
      body   : {
        csrfToken: csrfToken
      }
    })
    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(errorUserNotLoggedIn)
    )
  })
  test('user not logged in POST', async () => {
    const { req, res } = createMocks({
      method : 'POST',
      body   : {
        csrfToken: csrfToken
      }
    })
    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(errorUserNotLoggedIn)
    )
  })

  test('fetch Question For Signed User success', async () => {
    const spy = jest.spyOn(moduleDaoQuestion, 'fetchQuestionForSignedUser')

    spy.mockReturnValue(validObject)
    moduleApi.getSession = jest.fn().mockReturnValue({ user: { email: 'io@io.ba' } })

    const { req, res } = createMocks({
      method : 'GET',
      query  : {
        questionId: questionId
      }
    })
    await handler(req, res)

    spy.mockRestore()
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(validObject)
    )
  })

  test('created question success', async () => {
    const spy = jest.spyOn(moduleDaoQuestion, 'createQuestion')

    spy.mockReturnValue(validObject)
    moduleApi.getSession = jest.fn().mockReturnValue({ user: { email: 'io@io.ba' } })

    const { req, res } = createMocks({
      method : 'POST',
      body   : {
        csrfToken: csrfToken
      }
    })
    await handler(req, res)

    spy.mockRestore()
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(validObject)
    )
  })

  test('fetch Question For Signed User Error', async () => {
    const spy = jest.spyOn(moduleDaoQuestion, 'fetchQuestionForSignedUser')

    spy.mockImplementation(() => { throw errorObject })
    moduleApi.getSession = jest.fn().mockReturnValue({ user: { email: 'io@io.ba' } })

    const { req, res } = createMocks({
      method : 'GET',
      query  : {
        questionId: questionId
      }
    })
    await handler(req, res)

    spy.mockRestore()
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(errorWithDatabase)
    )
  })

  test('create question Database Error', async () => {
    const spy = jest.spyOn(moduleDaoQuestion, 'createQuestion')

    spy.mockImplementation(() => { throw errorObject })
    moduleApi.getSession = jest.fn().mockReturnValue({ user: { email: 'io@io.ba' } })

    const { req, res } = createMocks({
      method : 'POST',
      body   : {
        csrfToken: csrfToken
      }
    })
    await handler(req, res)

    spy.mockRestore()
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(errorWithDatabase)
    )
  })
})
