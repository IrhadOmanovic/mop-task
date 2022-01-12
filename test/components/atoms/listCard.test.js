import React from 'react'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'

import ListCard from '../../../components/patterns/atoms/listCard'
import { render, fireEvent } from '../../test-utils'

describe('ListCard', () => {
  let expectedProps

  beforeEach(() => {
    expectedProps = {
      headerTitle  : 'Test title',
      bodyTitle    : 'Test body title',
      bodyText     : 'Test body text',
      bodyFootnote : 'Test body footnote',
      footerText   : 'Test footer text'
    }
  })

  test('ListCard', () => {
    const { getByText } = render(<ListCard {...expectedProps} />)
    const headerTitle = getByText(expectedProps.headerTitle)
    const bodyTitle = getByText(expectedProps.bodyTitle)
    const bodyText = getByText(expectedProps.bodyText)
    const bodyFootnote = getByText(expectedProps.bodyFootnote)
    const footerText = getByText(expectedProps.footerText)

    expect(headerTitle).toBeVisible()
    expect(bodyTitle).toBeVisible()
    expect(bodyText).toBeVisible()
    expect(bodyFootnote).toBeVisible()
    expect(footerText).toBeVisible()
  })
})
