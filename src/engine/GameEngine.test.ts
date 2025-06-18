import { describe, it, expect, beforeEach } from 'vitest'
import {
  createEmptyBoard,
  createShip,
  placeShip,
  receiveShot,
  isFleetSunk,
  cpuNextShot,
  initializeGameState,
  updateTargetQueue,
} from './GameEngine'
import {
  ShipType,
  Orientation,
  CellState,
  ShotResult,
  BOARD_SIZE,
} from '../types/GameTypes'

describe('GameEngine', () => {
  describe('createEmptyBoard', () => {
    it('creates a 10x10 board with empty cells', () => {
      const board = createEmptyBoard()

      expect(board.grid).toHaveLength(BOARD_SIZE)
      expect(board.grid[0]).toHaveLength(BOARD_SIZE)
      expect(board.ships.size).toBe(0)

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          expect(board.grid[row][col].state).toBe(CellState.EMPTY)
        }
      }
    })
  })

  describe('createShip', () => {
    it('creates a ship with correct properties', () => {
      const ship = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )

      expect(ship.type).toBe(ShipType.DESTROYER)
      expect(ship.size).toBe(2)
      expect(ship.position).toEqual({ row: 0, col: 0 })
      expect(ship.orientation).toBe(Orientation.HORIZONTAL)
      expect(ship.hitSquares.size).toBe(0)
      expect(ship.isSunk).toBe(false)
    })
  })

  describe('placeShip', () => {
    let board: ReturnType<typeof createEmptyBoard>

    beforeEach(() => {
      board = createEmptyBoard()
    })

    it('successfully places a horizontal ship', () => {
      const ship = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )

      const result = placeShip(board, ship)

      expect(result.success).toBe(true)
      expect(board.grid[0][0].state).toBe(CellState.SHIP)
      expect(board.grid[0][1].state).toBe(CellState.SHIP)
      expect(board.ships.size).toBe(1)
    })

    it('successfully places a vertical ship', () => {
      const ship = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.VERTICAL
      )

      const result = placeShip(board, ship)

      expect(result.success).toBe(true)
      expect(board.grid[0][0].state).toBe(CellState.SHIP)
      expect(board.grid[1][0].state).toBe(CellState.SHIP)
    })

    it('rejects ship placement that extends beyond board boundaries', () => {
      const ship = createShip(
        ShipType.CARRIER,
        { row: 0, col: 8 },
        Orientation.HORIZONTAL
      )

      const result = placeShip(board, ship)

      expect(result.success).toBe(false)
      expect(result.error).toContain('extends beyond board boundaries')
    })

    it('rejects ship placement that overlaps with existing ship', () => {
      const ship1 = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )
      const ship2 = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 1 },
        Orientation.HORIZONTAL
      )

      placeShip(board, ship1)
      const result = placeShip(board, ship2)

      expect(result.success).toBe(false)
      expect(result.error).toContain('overlaps with existing ship')
    })

    it('rejects ship placement adjacent to existing ship', () => {
      const ship1 = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )
      const ship2 = createShip(
        ShipType.DESTROYER,
        { row: 1, col: 0 },
        Orientation.HORIZONTAL
      )

      placeShip(board, ship1)
      const result = placeShip(board, ship2)

      expect(result.success).toBe(false)
      expect(result.error).toContain('adjacent to existing ship')
    })

    it('allows ship placement with proper spacing', () => {
      const ship1 = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )
      const ship2 = createShip(
        ShipType.DESTROYER,
        { row: 2, col: 0 },
        Orientation.HORIZONTAL
      )

      const result1 = placeShip(board, ship1)
      const result2 = placeShip(board, ship2)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(board.ships.size).toBe(2)
    })
  })

  describe('receiveShot', () => {
    let board: ReturnType<typeof createEmptyBoard>

    beforeEach(() => {
      board = createEmptyBoard()
      const ship = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )
      placeShip(board, ship)
    })

    it('returns MISS for shot at empty water', () => {
      const result = receiveShot(board, { row: 5, col: 5 })

      expect(result).toBe(ShotResult.MISS)
      expect(board.grid[5][5].state).toBe(CellState.MISS)
    })

    it('returns HIT for shot at ship', () => {
      const result = receiveShot(board, { row: 0, col: 0 })

      expect(result).toBe(ShotResult.HIT)
      expect(board.grid[0][0].state).toBe(CellState.HIT)
    })

    it('returns SUNK when ship is completely destroyed', () => {
      receiveShot(board, { row: 0, col: 0 })
      const result = receiveShot(board, { row: 0, col: 1 })

      expect(result).toBe(ShotResult.SUNK)

      const ship = Array.from(board.ships.values())[0]
      expect(ship.isSunk).toBe(true)
    })

    it('returns INVALID for shot at already targeted coordinate', () => {
      receiveShot(board, { row: 0, col: 0 })
      const result = receiveShot(board, { row: 0, col: 0 })

      expect(result).toBe(ShotResult.INVALID)
    })

    it('returns INVALID for shot outside board boundaries', () => {
      const result = receiveShot(board, { row: -1, col: 0 })

      expect(result).toBe(ShotResult.INVALID)
    })

    it('returns INVALID for shot at previously missed coordinate', () => {
      receiveShot(board, { row: 5, col: 5 })
      const result = receiveShot(board, { row: 5, col: 5 })

      expect(result).toBe(ShotResult.INVALID)
    })
  })

  describe('isFleetSunk', () => {
    let board: ReturnType<typeof createEmptyBoard>

    beforeEach(() => {
      board = createEmptyBoard()
    })

    it('returns false for empty board', () => {
      const result = isFleetSunk(board)
      expect(result).toBe(false)
    })

    it('returns false when some ships are not sunk', () => {
      const ship1 = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )
      const ship2 = createShip(
        ShipType.CRUISER,
        { row: 2, col: 0 },
        Orientation.HORIZONTAL
      )

      placeShip(board, ship1)
      placeShip(board, ship2)

      receiveShot(board, { row: 0, col: 0 })
      receiveShot(board, { row: 0, col: 1 })

      const result = isFleetSunk(board)
      expect(result).toBe(false)
    })

    it('returns true when all ships are sunk', () => {
      const ship1 = createShip(
        ShipType.DESTROYER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )
      const ship2 = createShip(
        ShipType.DESTROYER,
        { row: 2, col: 0 },
        Orientation.HORIZONTAL
      )

      placeShip(board, ship1)
      placeShip(board, ship2)

      receiveShot(board, { row: 0, col: 0 })
      receiveShot(board, { row: 0, col: 1 })
      receiveShot(board, { row: 2, col: 0 })
      receiveShot(board, { row: 2, col: 1 })

      const result = isFleetSunk(board)
      expect(result).toBe(true)
    })
  })

  describe('cpuNextShot', () => {
    let gameState: ReturnType<typeof initializeGameState>

    beforeEach(() => {
      gameState = initializeGameState()
    })

    it('returns a valid coordinate', () => {
      const shot = cpuNextShot(gameState)

      expect(shot.row).toBeGreaterThanOrEqual(0)
      expect(shot.row).toBeLessThan(BOARD_SIZE)
      expect(shot.col).toBeGreaterThanOrEqual(0)
      expect(shot.col).toBeLessThan(BOARD_SIZE)
    })

    it('prefers checkerboard pattern in hunt mode', () => {
      const shots = new Set<string>()

      for (let i = 0; i < 20; i++) {
        const shot = cpuNextShot(gameState)
        const key = `${shot.row},${shot.col}`

        if (!shots.has(key)) {
          shots.add(key)
          receiveShot(gameState.opponentBoard, shot)
        }
      }

      const checkerboardShots = Array.from(shots).filter((key) => {
        const [row, col] = key.split(',').map(Number)
        return (row + col) % 2 === 0
      })

      expect(checkerboardShots.length).toBeGreaterThan(0)
    })

    it('targets adjacent squares after a hit', () => {
      const ship = createShip(
        ShipType.DESTROYER,
        { row: 5, col: 5 },
        Orientation.HORIZONTAL
      )
      placeShip(gameState.opponentBoard, ship)

      receiveShot(gameState.opponentBoard, { row: 5, col: 5 })
      updateTargetQueue(gameState, ShotResult.HIT, { row: 5, col: 5 })

      const nextShot = cpuNextShot(gameState)
      const adjacentCoords = [
        { row: 4, col: 5 },
        { row: 6, col: 5 },
        { row: 5, col: 4 },
        { row: 5, col: 6 },
      ]

      const isAdjacent = adjacentCoords.some(
        (coord) => coord.row === nextShot.row && coord.col === nextShot.col
      )

      expect(isAdjacent).toBe(true)
    })

    it('completes in reasonable time', () => {
      const startTime = performance.now()

      for (let i = 0; i < 100; i++) {
        cpuNextShot(gameState)
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime

      expect(totalTime).toBeLessThan(500)
    })

    it('avoids already targeted coordinates', () => {
      receiveShot(gameState.opponentBoard, { row: 0, col: 0 })
      receiveShot(gameState.opponentBoard, { row: 0, col: 1 })

      for (let i = 0; i < 10; i++) {
        const shot = cpuNextShot(gameState)
        expect(shot).not.toEqual({ row: 0, col: 0 })
        expect(shot).not.toEqual({ row: 0, col: 1 })
      }
    })
  })

  describe('updateTargetQueue', () => {
    let gameState: ReturnType<typeof initializeGameState>

    beforeEach(() => {
      gameState = initializeGameState()
    })

    it('switches to target mode after hit', () => {
      updateTargetQueue(gameState, ShotResult.HIT, { row: 5, col: 5 })

      expect(gameState.huntMode).toBe(false)
      expect(gameState.lastHit).toEqual({ row: 5, col: 5 })
      expect(gameState.targetQueue.length).toBeGreaterThan(0)
    })

    it('switches to hunt mode after sunk', () => {
      gameState.huntMode = false
      gameState.targetQueue = [{ row: 1, col: 1 }]

      updateTargetQueue(gameState, ShotResult.SUNK, { row: 5, col: 5 })

      expect(gameState.huntMode).toBe(true)
      expect(gameState.lastHit).toBeUndefined()
      expect(gameState.targetQueue).toHaveLength(0)
    })

    it('adds orthogonal adjacent coordinates to target queue', () => {
      updateTargetQueue(gameState, ShotResult.HIT, { row: 5, col: 5 })

      const expectedTargets = [
        { row: 4, col: 5 },
        { row: 6, col: 5 },
        { row: 5, col: 4 },
        { row: 5, col: 6 },
      ]

      expect(gameState.targetQueue).toHaveLength(4)

      for (const target of expectedTargets) {
        const found = gameState.targetQueue.some(
          (coord) => coord.row === target.row && coord.col === target.col
        )
        expect(found).toBe(true)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles corner ship placement', () => {
      const board = createEmptyBoard()
      const ship = createShip(
        ShipType.DESTROYER,
        { row: 9, col: 8 },
        Orientation.HORIZONTAL
      )

      const result = placeShip(board, ship)
      expect(result.success).toBe(true)
    })

    it('handles maximum size ship placement', () => {
      const board = createEmptyBoard()
      const ship = createShip(
        ShipType.CARRIER,
        { row: 0, col: 0 },
        Orientation.HORIZONTAL
      )

      const result = placeShip(board, ship)
      expect(result.success).toBe(true)
      expect(board.grid[0][4].state).toBe(CellState.SHIP)
    })

    it('handles shots at board edges', () => {
      const board = createEmptyBoard()

      const result1 = receiveShot(board, { row: 0, col: 0 })
      const result2 = receiveShot(board, { row: 9, col: 9 })

      expect(result1).toBe(ShotResult.MISS)
      expect(result2).toBe(ShotResult.MISS)
    })

    it('handles CPU shot selection with limited valid targets', () => {
      const gameState = initializeGameState()

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE - 1; col++) {
          receiveShot(gameState.opponentBoard, { row, col })
        }
      }

      const shot = cpuNextShot(gameState)
      expect(shot.col).toBe(9)
    })
  })
})
