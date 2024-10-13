"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from './lib/utils'

type TAnimal = {
  name: TAnimalName;
  animalsCanEat: TAnimalName[];
};

const allAnimals: TAnimal[] = [
  {
    name: 'elephant', animalsCanEat: [
      'lion', 'tiger','leopard','wolf', 'dog', 'cat'
    ]
  },
  {
    name: 'lion', animalsCanEat: [
      'tiger','leopard','wolf', 'dog', 'cat', 'rat'
    ]
  },
  {
    name: 'tiger', animalsCanEat: [
      'leopard','wolf', 'dog', 'cat', 'rat'
    ]
  },
  {
    name: 'leopard', animalsCanEat: [
      'wolf', 'dog', 'cat', 'rat'
    ]
  },
  {
    name: 'wolf', animalsCanEat: [
      'dog', 'cat', 'rat'
    ]
  },
  {
    name: 'dog', animalsCanEat: [
      'cat', 'rat'
    ]
  },
  {
    name: 'cat', animalsCanEat: [
      'rat'
    ]
  },
  {
    name: 'rat', animalsCanEat: [
      'elephant',
  ]},
]

type TCellName = 'den' | 'trap' | 'river' | ''

const  gameBoardLayout :TCellName[][]  = [
  ['','', 'trap', 'den', 'trap', '', ''],
  ['', '', '', 'trap', '', '', ''],
  ['',  '', '', '', '',  '', ''],
  ['', 'river', 'river', '', 'river', 'river', ''],
  ['', 'river', 'river', '', 'river', 'river', ''],
  ['', 'river', 'river', '', 'river', 'river', ''],
  ['',  '','','', '', '', '',],
  ['','', '', 'trap', '',  '', ''],
  ['', '', 'trap', 'den', 'trap', '', '']
];

const getCellEmoji = (cellName: TCellName) => {
  const cellEmojis = {
    den: '🏠',
    trap: '🕳️',
    river: '💧',
    '': '',
  } as const;
  return cellEmojis[cellName];
}

type TAnimalName = 'rat' | 'cat' | 'dog' | 'wolf' | 'leopard' | 'tiger' | 'lion' | 'elephant' | '';

const getAnimalEmoji = (animalName: TAnimalName) => {

  console.log('name', animalName)
  return {
    'elephant': '🐘',
    'lion': '🦁',
    'tiger': '🐯',
    'leopard': '🐆',
    'wolf': '🐺',
    'dog': '🐶',
    'cat': '🐱',
    'rat': '🐀',
    '': '',
  }[animalName]
}

type TPlayer = {
  name: string;
  color: string;
}

const createPlayerFromNo = (no: 1 | 2) => { 
  return {
    name: `Player ${no}`,
    color: no === 1 ? 'red' : 'blue',
  }
}

const createAnimal = (name: TAnimalName, playerNo: 1 | 2) => {
  return {
    name,
    player: createPlayerFromNo(playerNo),
  }
}

type TGameCellState = {
  name: TAnimalName;
  player: TPlayer;
} | ''

type TGameState = TGameCellState[][]

const initialGameState :TGameState  = [
  [createAnimal('lion', 1),'', '', '', '', '', createAnimal('tiger', 1)],
  ['', createAnimal('dog', 1), '', '', '', createAnimal('cat', 1), ''],
  [createAnimal('rat', 1),  '', createAnimal('leopard', 1), '', createAnimal('wolf', 1), '', createAnimal('elephant', 1)],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  [createAnimal('elephant', 2),  '',createAnimal('wolf', 2), '', createAnimal('leopard', 2), createAnimal('rat', 2)],
  ['', createAnimal('cat',2 ), '', '', '',  createAnimal('dog', 2), ''],
  [createAnimal('tiger', 2), '', '', '', '', '', createAnimal('lion', 2)]
];

export default function JungleGame() {
  const [gameState, setGameState] = useState<TGameState>([]);
  const [currentPlayer, setCurrentPlayer] = useState<TPlayer>(createPlayerFromNo(1));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [winner, setWinner] = useState<TPlayer | null>(null);

  const isriver = (row: number, col: number): boolean => {
    return gameBoardLayout[row][col] === 'river';
  };

  const isTrap = (row: number, col: number): boolean => {
    return gameBoardLayout[row][col] === 'trap';
  }

  const isDen = (row: number, col: number): boolean => {
    return gameBoardLayout[row][col] === 'den';
  }

  const canEat = (attacker: TAnimalName, defender: TAnimalName): boolean => {
    const attackerObj = allAnimals.find(animal => animal.name === attacker);
    return attackerObj?.animalsCanEat.includes(defender) || false;
  }

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    // const animal = boardLayout[fromRow][fromCol];
    // Additional logic for isValidMove
    return true;
  };


  const handleCellClick = (row: number, col: number) => {
   
   
  };

  const initGame = () => {
    setGameState(initialGameState);
    setCurrentPlayer(createPlayerFromNo(1));
    setSelectedCell(null);
    setWinner(null);  
  }

  useEffect(() => {
    initGame()
  }, [])


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Jungle Game</h1>
      <div className={`mb-4 text-2xl font-bold ${currentPlayer.color === 'red' ? 'text-red-600' : 'text-blue-600'}`}>
        Current Player: {currentPlayer.color === 'red' ? '🔴' : '🔵'}
      </div>
      <div className="grid grid-cols-7 gap-1 p-4 bg-green-400 rounded-lg shadow-lg">
        {gameBoardLayout.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              className={cn(`w-12 h-12 flex items-center justify-center text-2xl`,
                // getAnimalColor(rowIndex, colIndex) === 'red' ? 'bg-red-200' :
                // getAnimalColor(rowIndex, colIndex) === 'blue' ? 'bg-blue-200' : ''
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              variant="outline"
            >
              {getCellEmoji(cell)}

              <span className="absolute">{   getAnimalEmoji(gameState?.[rowIndex]?.[colIndex]?.name)}</span>

              
            </Button>
          ))
        ))}
      </div>
      {winner && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Game Over!</AlertTitle>
          <AlertDescription>
            {winner.color === 'red' ? '🔴' : '🔵'} player wins!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
