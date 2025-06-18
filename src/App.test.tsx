import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders Battleship coming soon message', () => {
    render(<App />)
    expect(screen.getByText('Battleship')).toBeInTheDocument()
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })
})
