import React from 'react'
import * as reduxApi from 'react-redux'

import { render } from '../test-utils'
import Registration from '../../pages/registration'

jest.mock('react-redux')

describe('Registration page', () => {
  test('should render', async () => {
    reduxApi.useSelector = jest.fn().mockReturnValue('')
    const { getByTestId, getByText } = render(<Registration />)
    const email = getByTestId('register-email')
    const emailConfirm = getByTestId('register-email-confirm')
    const firstName = getByTestId('register-first-name')
    const lastName = getByTestId('register-last-name')
    const password = getByTestId('register-password')
    const passwordConfirm = getByTestId('register-password-confirm')
    const signInButton = getByText('Submit')

    expect(email).toBeVisible()
    expect(emailConfirm).toBeVisible()
    expect(firstName).toBeVisible()
    expect(lastName).toBeVisible()
    expect(password).toBeVisible()
    expect(passwordConfirm).toBeVisible()
    expect(signInButton).toBeVisible()
  })
})
