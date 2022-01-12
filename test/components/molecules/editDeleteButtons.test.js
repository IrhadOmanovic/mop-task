import React from 'react'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'

import EditDeleteButtons from '../../../components/patterns/molecules/editDeleteButtons'
import { render, fireEvent } from '../../test-utils'
import * as moduleApi from 'next-auth/react'

jest.mock('next-auth/react')

// Somewhere in your test case or test suite

describe('EditDeleteButtons', () => {
  let expectedProps

  beforeEach(() => {
    moduleApi.useSession = jest.fn().mockReturnValue({ status: 'authenticated' })

    expectedProps = {
      onDeleteClick : jest.fn(),
      onEditClick   : jest.fn(),
      show          : true
    }
  })

  test('EditDeleteButtons show=true signedIn', () => {
    const { getByText, getByTestId } = render(<EditDeleteButtons {...expectedProps} />)
    const cont = getByTestId('EditDeleteButtons-container')
    const edit = getByText('Edit')
    const del = getByText('Delete')

    fireEvent.click(edit)
    fireEvent.click(del)
    expect(expectedProps.onDeleteClick).toHaveBeenCalledTimes(1)
    expect(expectedProps.onEditClick).toHaveBeenCalledTimes(1)

    expect(cont).toBeVisible()
  })

  test('EditDeleteButtons show=false signedIn', () => {
    const adjustedProps = expectedProps
    adjustedProps.show = false

    const { queryByTestId } = render(<EditDeleteButtons {...adjustedProps} />)

    expect(queryByTestId('EditDeleteButtons-container')).not.toBeInTheDocument()
  })

  test('EditDeleteButtons show=false signedout', () => {
    moduleApi.useSession = jest.fn().mockReturnValue({ status: 'loading' })
    const adjustedProps = expectedProps
    adjustedProps.show = false

    const { queryByTestId } = render(<EditDeleteButtons {...expectedProps} />)

    expect(queryByTestId('EditDeleteButtons-container')).not.toBeInTheDocument()
  })

  test('EditDeleteButtons show=true signedout', () => {
    moduleApi.useSession = jest.fn().mockReturnValue({ status: 'loading' })

    const { queryByTestId } = render(<EditDeleteButtons {...expectedProps} />)

    expect(queryByTestId('EditDeleteButtons-container')).not.toBeInTheDocument()
  })
})
