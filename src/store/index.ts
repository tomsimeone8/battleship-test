import { create } from 'zustand'
import type { Board, Ship, Coordinate } from '../types/GameTypes'
import { ShotResult } from '../types/GameTypes'
import {
  createEmptyBoard,
  placeShip,
  receiveShot,
  isFleetSunk,
  cpuNextShot,
  initializeGameState,
  updateTargetQueue,
} from '../engine/GameEngine'

interface GameStore {
  gameStarted: boolean
  playerBoard: Board
  opponentBoard: Board
  currentPlayer: 'player' | 'cpu'
  gamePhase: 'setup' | 'playing' | 'finished'
  winner?: 'player' | 'cpu'
  targetQueue: Coordinate[]
  lastHit?: Coordinate
  huntMode: boolean

  setGameStarted: (started: boolean) => void
  initializeGame: () => void
  placePlayerShip: (ship: Ship) => { success: boolean; error?: string }
  playerShoot: (coordinate: Coordinate) => ShotResult
  cpuShoot: () => { coordinate: Coordinate; result: ShotResult }
  checkGameEnd: () => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameStarted: false,
  playerBoard: createEmptyBoard(),
  opponentBoard: createEmptyBoard(),
  currentPlayer: 'player',
  gamePhase: 'setup',
  targetQueue: [],
  huntMode: true,

  setGameStarted: (started) => set({ gameStarted: started }),

  initializeGame: () => {
    const gameState = initializeGameState()
    set({
      playerBoard: gameState.playerBoard,
      opponentBoard: gameState.opponentBoard,
      currentPlayer: gameState.currentPlayer,
      gamePhase: gameState.gamePhase,
      targetQueue: gameState.targetQueue,
      huntMode: gameState.huntMode,
      winner: undefined,
      lastHit: undefined,
    })
  },

  placePlayerShip: (ship: Ship) => {
    const state = get()
    const result = placeShip(state.playerBoard, ship)

    if (result.success) {
      set({ playerBoard: { ...state.playerBoard } })
    }

    return result
  },

  playerShoot: (coordinate: Coordinate) => {
    const state = get()
    const result = receiveShot(state.opponentBoard, coordinate)

    if (result !== ShotResult.INVALID) {
      set({
        opponentBoard: { ...state.opponentBoard },
        currentPlayer: 'cpu',
      })

      get().checkGameEnd()
    }

    return result
  },

  cpuShoot: () => {
    const state = get()
    const gameState = {
      playerBoard: state.playerBoard,
      opponentBoard: state.opponentBoard,
      currentPlayer: state.currentPlayer,
      gamePhase: state.gamePhase,
      winner: state.winner,
      targetQueue: [...state.targetQueue],
      lastHit: state.lastHit,
      huntMode: state.huntMode,
    }

    const coordinate = cpuNextShot(gameState)
    const result = receiveShot(state.playerBoard, coordinate)

    if (result !== ShotResult.INVALID) {
      updateTargetQueue(gameState, result, coordinate)

      set({
        playerBoard: { ...state.playerBoard },
        currentPlayer: 'player',
        targetQueue: gameState.targetQueue,
        lastHit: gameState.lastHit,
        huntMode: gameState.huntMode,
      })

      get().checkGameEnd()
    }

    return { coordinate, result }
  },

  checkGameEnd: () => {
    const state = get()

    if (isFleetSunk(state.playerBoard)) {
      set({
        gamePhase: 'finished',
        winner: 'cpu',
      })
    } else if (isFleetSunk(state.opponentBoard)) {
      set({
        gamePhase: 'finished',
        winner: 'player',
      })
    }
  },

  resetGame: () => {
    get().initializeGame()
    set({ gameStarted: false })
  },
}))
