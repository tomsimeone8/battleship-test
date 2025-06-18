import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders Battleship coming soon message', () => {
    render(<App />)
    expect(screen.getByText('Battleship')).toBeInTheDocument()
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('renders player and opponent boards', () => {
    render(<App />)
    expect(screen.getByText('Player Board')).toBeInTheDocument()
    expect(screen.getByText('Opponent Board')).toBeInTheDocument()
  })

  it('renders grid cells for both boards', () => {
    render(<App />)
    const gridCells = screen.getAllByRole('generic')
    expect(gridCells.length).toBeGreaterThan(200)
  })
})
