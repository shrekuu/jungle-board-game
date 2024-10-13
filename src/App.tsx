'use client';

import { useEffect, useState } from 'react';
import { cn } from './lib/utils';

type TAnimal = {
  name: TAnimalName;
  animalsCanEat: TAnimalName[];
};

const allAnimals: TAnimal[] = [
  {
    name: 'elephant',
    animalsCanEat: ['elephant', 'lion', 'tiger', 'leopard', 'wolf', 'dog', 'cat'],
  },
  {
    name: 'lion',
    animalsCanEat: ['lion', 'tiger', 'leopard', 'wolf', 'dog', 'cat', 'rat'],
  },
  {
    name: 'tiger',
    animalsCanEat: ['tiger', 'leopard', 'wolf', 'dog', 'cat', 'rat'],
  },
  {
    name: 'leopard',
    animalsCanEat: ['leopard', 'wolf', 'dog', 'cat', 'rat'],
  },
  {
    name: 'wolf',
    animalsCanEat: ['wolf', 'dog', 'cat', 'rat'],
  },
  {
    name: 'dog',
    animalsCanEat: ['dog', 'cat', 'rat'],
  },
  {
    name: 'cat',
    animalsCanEat: ['cat', 'rat'],
  },
  {
    name: 'rat',
    animalsCanEat: ['rat', 'elephant'],
  },
];

type TCellName = 'den' | 'trap' | 'river' | '';

const gameBoardLayout: TCellName[][] = [
  ['', '', 'trap', 'den', 'trap', '', ''],
  ['', '', '', 'trap', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', 'river', 'river', '', 'river', 'river', ''],
  ['', 'river', 'river', '', 'river', 'river', ''],
  ['', 'river', 'river', '', 'river', 'river', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', 'trap', '', '', ''],
  ['', '', 'trap', 'den', 'trap', '', ''],
];

const getCellEmoji = (cellName: TCellName) => {
  const cellEmojis = {
    den: '🏠',
    trap: '🕳️',
    river: '💧',
    '': '',
  } as const;
  return cellEmojis[cellName];
};

type TAnimalName = 'rat' | 'cat' | 'dog' | 'wolf' | 'leopard' | 'tiger' | 'lion' | 'elephant' | '';

const getAnimalEmoji = (animalName: TAnimalName) => {
  return {
    elephant: '🐘',
    lion: '🦁',
    tiger: '🐯',
    leopard: '🐆',
    wolf: '🐺',
    dog: '🐶',
    cat: '🐱',
    rat: '🐀',
    '': '',
  }[animalName];
};

type TPlayer = {
  name: string;
  color: string;
};

const createPlayerFromNo = (no: 1 | 2) => {
  return {
    name: `Player ${no}`,
    color: no === 1 ? 'red' : 'blue',
  };
};

const createAnimal = (name: TAnimalName, playerNo: 1 | 2) => {
  return {
    name,
    player: createPlayerFromNo(playerNo),
  };
};

type TGameCellState =
  | {
      name: TAnimalName;
      player: TPlayer;
    }
  | '';

type TGameState = TGameCellState[][];

const initialGameState: TGameState = [
  [createAnimal('lion', 1), '', '', '', '', '', createAnimal('tiger', 1)],
  ['', createAnimal('dog', 1), '', '', '', createAnimal('cat', 1), ''],
  [
    createAnimal('rat', 1),
    '',
    createAnimal('leopard', 1),
    '',
    createAnimal('wolf', 1),
    '',
    createAnimal('elephant', 1),
  ],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  [
    createAnimal('elephant', 2),
    '',
    createAnimal('wolf', 2),
    '',
    createAnimal('leopard', 2),
    '',
    createAnimal('rat', 2),
  ],
  ['', createAnimal('cat', 2), '', '', '', createAnimal('dog', 2), ''],
  [createAnimal('tiger', 2), '', '', '', '', '', createAnimal('lion', 2)],
];

export default function JungleGame() {
  const [gameState, setGameState] = useState<TGameState>([]);
  // const [currentPlayer, setCurrentPlayer] = useState<TPlayer>(createPlayerFromNo(1));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [winner, setWinner] = useState<TPlayer | null>(null);

  const isriver = (row: number, col: number): boolean => {
    return gameBoardLayout[row][col] === 'river';
  };

  const isTrap = (row: number, col: number): boolean => {
    return gameBoardLayout[row][col] === 'trap';
  };

  const isDen = (row: number, col: number): boolean => {
    return gameBoardLayout[row][col] === 'den';
  };

  const canEat = (attacker: TAnimalName, defender: TAnimalName): boolean => {
    const attackerObj = allAnimals.find((animal) => animal.name === attacker);
    return attackerObj?.animalsCanEat.includes(defender) || false;
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    // can't move to the same cell
    if (fromRow === toRow && fromCol === toCol) {
      console.warn("can't move to the same cell");
      return false;
    }

    const currentPlayer =
      selectedCell &&
      gameState[selectedCell[0]][selectedCell[1]] &&
      gameState[selectedCell[0]][selectedCell[1]]?.player;

    // can't move to a cell that has the same player's animal
    if (gameState[toRow][toCol] && gameState[toRow][toCol].player.color === currentPlayer.color) {
      console.warn("can't move to a cell that has the same player's animal");
      return false;
    }

    // can't move to a cell that is a river if the animal is not a rat
    if (isriver(toRow, toCol) && gameState[fromRow][fromCol] && gameState[fromRow][fromCol].name !== 'rat') {
      console.warn("can't move to a cell that is a river if the animal is not a rat");
      return false;
    }

    // can't eat oponent's animal that is not in the animalsCanEat list
    if (gameState[toRow][toCol] && gameState[toRow][toCol].player.color !== currentPlayer.color) {
      if (gameState[fromRow][fromCol] && !canEat(gameState[fromRow][fromCol].name, gameState[toRow][toCol].name)) {
        console.warn("can't eat oponent's animal that is not in the animalsCanEat list");
        return false;
      }
    }

    // can only move to cells that is next to the current cell
    if (Math.abs(fromRow - toRow) > 1 || Math.abs(fromCol - toCol) > 1) {
      console.warn('can only move to cells that is next to the current cell');
      return false;
    }

    // cannot move diagonally
    if (fromRow !== toRow && fromCol !== toCol) {
      console.warn('cannot move diagonally');
      return false;
    }

    // eat the opponent's animal

    return true;
  };

  const hasAnimal = (row: number, col: number): boolean => {
    return gameState[row][col] !== '';
  };

  const checkWinner = () => {
    // if one of the player's animal reaches the den, the player wins
    // TODO: implement this

    // if all of the opponent's animals are eaten, the current player wins
    const redPlayerAnimals = gameState.flat().filter((cell) => cell && cell.player.color === 'red');
    const bluePlayerAnimals = gameState.flat().filter((cell) => cell && cell.player.color === 'blue');

    const redPlayerWon = bluePlayerAnimals.every((cell) => cell && cell.name === '');
    const bluePlayerWon = redPlayerAnimals.every((cell) => cell && cell.name === '');

    if (redPlayerWon) {
      setWinner(createPlayerFromNo(1));
      alert('Congrats! Red Player Won!!!');
    }

    if (bluePlayerWon) {
      setWinner(createPlayerFromNo(2));
      alert('Congrats! Blue Player Won!!!');
    }
  };

  const handleCellClick = (row: number, col: number) => {
    // click again current player's animal to unselect
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      setSelectedCell(null);
      return;
    }

    // click another current player's animal to select
    if (selectedCell === null && hasAnimal(row, col)) {
      setSelectedCell([row, col]);
      return;
    }

    const currentPlayer =
      selectedCell &&
      gameState[selectedCell[0]][selectedCell[1]] &&
      gameState[selectedCell[0]][selectedCell[1]]?.player;

    // if target cell has my animal, select it
    if (
      selectedCell &&
      hasAnimal(row, col) &&
      currentPlayer &&
      gameState[row][col] &&
      currentPlayer.color === gameState[row][col].player.color
    ) {
      setSelectedCell([row, col]);
      return;
    }

    if (selectedCell && isValidMove(selectedCell[0], selectedCell[1], row, col)) {
      const newGameState = [...gameState];
      newGameState[row][col] = gameState[selectedCell[0]][selectedCell[1]];
      newGameState[selectedCell[0]][selectedCell[1]] = '';
      setGameState(newGameState);
      setSelectedCell(null);
    }

    // let previous view render pass
    setTimeout(() => {
      checkWinner();
    }, 200);
  };

  const resetGame = () => {
    initGame();
  };

  const initGame = () => {
    setGameState(initialGameState);
    setSelectedCell(null);
    setWinner(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-100 p-4">
      <h1 className="mb-4">
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-4xl font-bold text-transparent">
          Jungle
        </span>
      </h1>
      <div className="grid grid-cols-7 gap-1 rounded-lg bg-green-400 p-4 shadow-lg">
        {gameBoardLayout.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                `relative flex h-10 w-10 select-none items-center justify-center rounded bg-white text-2xl md:h-12 md:w-12`,
                {
                  'z-10 scale-110 ring-4 ring-red-500':
                    selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex,
                }
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {getCellEmoji(cell)}
              <div
                className={cn(
                  'absolute inset-0 grid cursor-pointer place-content-center rounded bg-white/50 text-3xl',
                  {
                    'bg-red-200':
                      gameState?.[rowIndex]?.[colIndex] && gameState?.[rowIndex]?.[colIndex]?.player.color === 'red',
                    'bg-blue-200':
                      gameState?.[rowIndex]?.[colIndex] && gameState?.[rowIndex]?.[colIndex]?.player.color === 'blue',
                  }
                )}
              >
                {gameState?.[rowIndex]?.[colIndex] && gameState?.[rowIndex]?.[colIndex]?.name !== ''
                  ? getAnimalEmoji(gameState[rowIndex][colIndex].name)
                  : ''}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4">
        <button className="h-10 rounded-full bg-red-600 px-4 font-bold text-neutral-100" onClick={resetGame}>
          reset
        </button>
      </div>
    </div>
  );
}
