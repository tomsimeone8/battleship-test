import type {
  Board,
  Ship,
  Coordinate,
  PlacementResult,
  GameState,
  Cell,
} from '../types/GameTypes'
import {
  Orientation,
  ShipType,
  CellState,
  ShotResult,
  SHIP_SIZES,
  BOARD_SIZE,
} from '../types/GameTypes'

export function createEmptyBoard(): Board {
  const grid: Cell[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({
          state: CellState.EMPTY,
        }))
    )

  return {
    grid,
    ships: new Map(),
  }
}

export function createShip(
  type: ShipType,
  position: Coordinate,
  orientation: Orientation
): Ship {
  return {
    type,
    size: SHIP_SIZES[type],
    position,
    orientation,
    hitSquares: new Set(),
    isSunk: false,
  }
}

function coordinateToString(coord: Coordinate): string {
  return `${coord.row},${coord.col}`
}

function getShipCoordinates(ship: Ship): Coordinate[] {
  const coordinates: Coordinate[] = []
  const { position, size, orientation } = ship

  for (let i = 0; i < size; i++) {
    if (orientation === Orientation.HORIZONTAL) {
      coordinates.push({
        row: position.row,
        col: position.col + i,
      })
    } else {
      coordinates.push({
        row: position.row + i,
        col: position.col,
      })
    }
  }

  return coordinates
}

function isValidCoordinate(coord: Coordinate): boolean {
  return (
    coord.row >= 0 &&
    coord.row < BOARD_SIZE &&
    coord.col >= 0 &&
    coord.col < BOARD_SIZE
  )
}

function getAdjacentCoordinates(coord: Coordinate): Coordinate[] {
  const adjacent: Coordinate[] = []
  const directions = [
    { row: -1, col: -1 },
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ]

  for (const dir of directions) {
    const newCoord = {
      row: coord.row + dir.row,
      col: coord.col + dir.col,
    }
    if (isValidCoordinate(newCoord)) {
      adjacent.push(newCoord)
    }
  }

  return adjacent
}

export function placeShip(board: Board, ship: Ship): PlacementResult {
  const shipCoords = getShipCoordinates(ship)

  for (const coord of shipCoords) {
    if (!isValidCoordinate(coord)) {
      return {
        success: false,
        error: `Ship extends beyond board boundaries at ${coord.row},${coord.col}`,
      }
    }
  }

  for (const coord of shipCoords) {
    if (board.grid[coord.row][coord.col].state === CellState.SHIP) {
      return {
        success: false,
        error: `Ship overlaps with existing ship at ${coord.row},${coord.col}`,
      }
    }
  }

  for (const coord of shipCoords) {
    const adjacentCoords = getAdjacentCoordinates(coord)
    for (const adjCoord of adjacentCoords) {
      if (board.grid[adjCoord.row][adjCoord.col].state === CellState.SHIP) {
        return {
          success: false,
          error: `Ship is adjacent to existing ship near ${coord.row},${coord.col}`,
        }
      }
    }
  }

  const shipId = `${ship.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  board.ships.set(shipId, ship)

  for (const coord of shipCoords) {
    board.grid[coord.row][coord.col] = {
      state: CellState.SHIP,
      shipId,
    }
  }

  return { success: true }
}

export function receiveShot(board: Board, coordinate: Coordinate): ShotResult {
  if (!isValidCoordinate(coordinate)) {
    return ShotResult.INVALID
  }

  const cell = board.grid[coordinate.row][coordinate.col]

  if (cell.state === CellState.HIT || cell.state === CellState.MISS) {
    return ShotResult.INVALID
  }

  if (cell.state === CellState.SHIP && cell.shipId) {
    board.grid[coordinate.row][coordinate.col].state = CellState.HIT

    const ship = board.ships.get(cell.shipId)!
    const coordString = coordinateToString(coordinate)
    ship.hitSquares.add(coordString)

    if (ship.hitSquares.size === ship.size) {
      ship.isSunk = true
      return ShotResult.SUNK
    }

    return ShotResult.HIT
  }

  board.grid[coordinate.row][coordinate.col].state = CellState.MISS
  return ShotResult.MISS
}

export function isFleetSunk(board: Board): boolean {
  for (const ship of board.ships.values()) {
    if (!ship.isSunk) {
      return false
    }
  }
  return board.ships.size > 0
}

function getValidTargets(board: Board): Coordinate[] {
  const targets: Coordinate[] = []

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board.grid[row][col]
      if (cell.state === CellState.EMPTY || cell.state === CellState.SHIP) {
        targets.push({ row, col })
      }
    }
  }

  return targets
}

function getOrthogonalAdjacent(coord: Coordinate): Coordinate[] {
  const adjacent: Coordinate[] = []
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ]

  for (const dir of directions) {
    const newCoord = {
      row: coord.row + dir.row,
      col: coord.col + dir.col,
    }
    if (isValidCoordinate(newCoord)) {
      adjacent.push(newCoord)
    }
  }

  return adjacent
}

function updateTargetQueue(
  gameState: GameState,
  lastShotResult: ShotResult,
  lastCoord: Coordinate
): void {
  if (lastShotResult === ShotResult.HIT) {
    gameState.huntMode = false
    gameState.lastHit = lastCoord

    const adjacentTargets = getOrthogonalAdjacent(lastCoord).filter((coord) => {
      const cell = gameState.opponentBoard.grid[coord.row][coord.col]
      return cell.state === CellState.EMPTY || cell.state === CellState.SHIP
    })

    gameState.targetQueue.unshift(...adjacentTargets)
  } else if (lastShotResult === ShotResult.SUNK) {
    gameState.huntMode = true
    gameState.lastHit = undefined
    gameState.targetQueue = []
  }
}

export function cpuNextShot(gameState: GameState): Coordinate {
  const validTargets = getValidTargets(gameState.opponentBoard)

  if (validTargets.length === 0) {
    return { row: 0, col: 0 }
  }

  if (!gameState.huntMode && gameState.targetQueue.length > 0) {
    const target = gameState.targetQueue.shift()!
    const cell = gameState.opponentBoard.grid[target.row][target.col]

    if (cell.state === CellState.EMPTY || cell.state === CellState.SHIP) {
      return target
    }

    return cpuNextShot(gameState)
  }

  const checkerboardTargets = validTargets.filter(
    (coord) => (coord.row + coord.col) % 2 === 0
  )

  if (checkerboardTargets.length > 0) {
    const randomIndex = Math.floor(Math.random() * checkerboardTargets.length)
    return checkerboardTargets[randomIndex]
  }

  const randomIndex = Math.floor(Math.random() * validTargets.length)
  return validTargets[randomIndex]
}

export function initializeGameState(): GameState {
  return {
    playerBoard: createEmptyBoard(),
    opponentBoard: createEmptyBoard(),
    currentPlayer: 'player',
    gamePhase: 'setup',
    targetQueue: [],
    huntMode: true,
  }
}

export { updateTargetQueue }
