import React from 'react'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'

import IconButton from '../../../components/patterns/atoms/iconButton'
import { render, fireEvent } from '../../test-utils'

describe('IconButton', () => {
  let expectedProps

  beforeEach(() => {
    expectedProps = {
      active  : true,
      icon    : faThumbsUp,
      onClick : jest.fn(),
      text    : 'Test text'
    }
  })

  test('IconButton', () => {
    const handleChange = jest.fn()
    const { container, getByText, getByTestId } = render(<IconButton {...expectedProps} />)
    const text = getByText(expectedProps.text)
    const icon = getByTestId('IconButton-icon')

    fireEvent.click(container.firstChild)
    expect(expectedProps.onClick).toHaveBeenCalledTimes(1)

    expect(text).toBeVisible()
    expect(icon).toBeVisible()
  })
})
