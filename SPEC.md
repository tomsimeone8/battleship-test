# Battleship Game Specification

## 1. Overview

This document defines the rules and technical requirements for the Battleship game implementation.

## 2. Game Rules and Board Setup

### 2.1 Board Configuration

- **Grid Size**: 10x10 grid
- **Coordinates**: Columns labeled A-J, rows numbered 1-10 (e.g., A1, B5, J10)
- **Two Boards**: Each player has their own board for ship placement

### 2.2 Fleet Composition

Each player's fleet consists of 5 ships:

- **Carrier**: 5 squares
- **Battleship**: 4 squares
- **Cruiser**: 3 squares
- **Submarine**: 3 squares
- **Destroyer**: 2 squares

### 2.3 Ship Placement Rules

- Ships must be placed horizontally or vertically (no diagonal placement)
- Ships cannot overlap or occupy the same square
- Ships cannot be adjacent to each other (must have at least one empty square between them)
- Ships must be completely within the board boundaries
- All ships must be placed before gameplay begins

## 3. Gameplay Mechanics

### 3.1 Turn Structure

- Players alternate taking shots at opponent's board
- Each turn consists of selecting one coordinate to attack
- Player receives immediate feedback: "Hit", "Miss", or "Sunk"

### 3.2 Shot Resolution

- **Miss**: Shot lands on empty water
- **Hit**: Shot lands on a ship square that hasn't been hit before
- **Sunk**: Shot destroys the last remaining square of a ship
- **Invalid**: Shot targets a coordinate that was already attacked

### 3.3 Win Conditions

- Game ends when all ships in a player's fleet are completely destroyed
- The player who sinks all opponent ships first wins
- No draws or ties possible

### 3.4 AI Behavior Requirements

- **Hunt Mode**: Random shot selection when no ships are currently being targeted
- **Target Mode**: After hitting a ship, prioritize adjacent squares to find remaining ship squares
- **Performance**: AI must select next shot in under 500ms
- **Intelligence**: Avoid shooting at coordinates that cannot contain unsunk ships

## 4. Technical Implementation Requirements

### 4.1 Data Structures

- Board state must track: empty water, ship positions, hit locations, missed shots
- Ship state must track: position, orientation, hit squares, sunk status
- Game state must track: current player, game phase, move history

### 4.2 Validation Requirements

- All ship placements must be validated before acceptance
- All shot attempts must be validated for coordinate format and previous attempts
- Game state transitions must be atomic and consistent

### 4.3 Performance Requirements

- Ship placement validation: < 50ms
- Shot processing: < 100ms
- AI shot selection: < 500ms
- Win condition checking: < 50ms

### 4.4 Error Handling

- Invalid coordinates must return descriptive error messages
- Placement violations must specify the exact rule violated
- All functions must handle edge cases gracefully without throwing exceptions
