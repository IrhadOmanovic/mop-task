import { render } from '@testing-library/react'

// Add in any providers here if necessary:
const Providers = ({ children }) => {
  return children
}

/**
 * @jest-environment jsdom
 */
const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react'

// override render method
// eslint-disable-next-line import/export
export { customRender as render }
