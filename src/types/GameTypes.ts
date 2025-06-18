export enum ShipType {
  CARRIER = 'CARRIER',
  BATTLESHIP = 'BATTLESHIP',
  CRUISER = 'CRUISER',
  SUBMARINE = 'SUBMARINE',
  DESTROYER = 'DESTROYER',
}

export enum Orientation {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

export enum CellState {
  EMPTY = 'EMPTY',
  SHIP = 'SHIP',
  HIT = 'HIT',
  MISS = 'MISS',
}

export enum ShotResult {
  HIT = 'HIT',
  MISS = 'MISS',
  SUNK = 'SUNK',
  INVALID = 'INVALID',
}

export interface Coordinate {
  row: number
  col: number
}

export interface Ship {
  type: ShipType
  size: number
  position: Coordinate
  orientation: Orientation
  hitSquares: Set<string>
  isSunk: boolean
}

export interface Cell {
  state: CellState
  shipId?: string
}

export interface Board {
  grid: Cell[][]
  ships: Map<string, Ship>
}

export interface GameState {
  playerBoard: Board
  opponentBoard: Board
  currentPlayer: 'player' | 'cpu'
  gamePhase: 'setup' | 'playing' | 'finished'
  winner?: 'player' | 'cpu'
  targetQueue: Coordinate[]
  lastHit?: Coordinate
  huntMode: boolean
}

export interface PlacementResult {
  success: boolean
  error?: string
}

export const SHIP_SIZES: Record<ShipType, number> = {
  [ShipType.CARRIER]: 5,
  [ShipType.BATTLESHIP]: 4,
  [ShipType.CRUISER]: 3,
  [ShipType.SUBMARINE]: 3,
  [ShipType.DESTROYER]: 2,
}

export const BOARD_SIZE = 10
