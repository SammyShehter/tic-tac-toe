import React, { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import styled from 'styled-components'
import gameContext from '../../contexts/game.context'
import gameService from '../../services/game.service'
import socketService from '../../services/socket.service'

const GameContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: 'Zen Tokyo Zoo', cursive;
    position: relative;
`

const RowContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

interface ICellProps {
    borderTop?: boolean
    borderRight?: boolean
    borderLeft?: boolean
    borderBottom?: boolean
}

const Cell = styled.div<ICellProps>`
    width: 13em;
    height: 9em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-top: ${({ borderTop }) => borderTop && '3px solid black'};
    border-left: ${({ borderLeft }) => borderLeft && '3px solid black'};
    border-bottom: ${({ borderBottom }) => borderBottom && '3px solid black'};
    border-right: ${({ borderRight }) => borderRight && '3px solid black'};

    &:hover {
        background: #8d44ad28;
    }
`

const PlayStopper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 99;
    cursor: default;
`

const WaitMessage = styled.h2`
    margin:0 auto;
`

const X = styled.div`
    font-size: 100px;
    color: black;
    &::after {
        content: 'X';
    }
`

const O = styled.div`
    font-size: 100px;
    color: black;
    &::after {
        content: 'O';
    }
`

export type IPlayMatrix = Array<Array<string | null>>
export interface IStartGame {
    start: boolean
    symbol: 'x' | 'o'
}
export function Game() {
    const [matrix, setMatrix] = useState<IPlayMatrix>([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ])

    const {playerSymbol, setPlayerSymbol, isPlayerTurn, setPlayerTurn, isGameStarted, setGameStarted} = useContext(gameContext)

    const checkGameState = (matrix: IPlayMatrix) => {
        for (let i = 0; i < matrix.length; i++) {
            let row = [];
            for (let j = 0; j < matrix[i].length; j++) {
              row.push(matrix[i][j]);
            }
      
            if (row.every((value) => value && value === playerSymbol)) {
              return [true, false];
            } else if (row.every((value) => value && value !== playerSymbol)) {
              return [false, true];
            }
        }
    
        for (let i = 0; i < matrix.length; i++) {
            let column = [];
            for (let j = 0; j < matrix[i].length; j++) {
              column.push(matrix[j][i]);
            }
      
            if (column.every((value) => value && value === playerSymbol)) {
              return [true, false];
            } else if (column.every((value) => value && value !== playerSymbol)) {
              return [false, true];
            }
        }
    
        if (matrix[1][1]) {
            if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
              if (matrix[1][1] === playerSymbol) return [true, false];
              else return [false, true];
            }
      
            if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
              if (matrix[1][1] === playerSymbol) return [true, false];
              else return [false, true];
            }
        }
    
        //Tie
        if (matrix.every((m) => m.every((v) => v !== null))) {
          return [true, true];
        }
    
        return [false, false];
      };

    const updateGameMatrix = (column: number, row: number, symbol: 'x' | 'o') => {
        const newMatrix = [...matrix]

        if(newMatrix[row][column] === null || newMatrix[row][column] === 'null'){
            newMatrix[row][column] = symbol
            setMatrix(newMatrix)
        }
        if(socketService.socket)
            gameService.updateGame(socketService.socket, newMatrix)
            const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix)
            if(currentPlayerWon && otherPlayerWon){
                gameService.gameWin(socketService.socket as Socket, 'Tie!')
                alert('Tie!')
            } else if (currentPlayerWon && !otherPlayerWon) {
                gameService.gameWin(socketService.socket as Socket, 'You lost =(')
                alert('You won! =)')
            }
                
            setPlayerTurn(false)
            
    }

    const handleGameUpdate = () => {
        if(socketService.socket)
            gameService.onGameUpdate(socketService.socket, (newMatrix) => {
                setMatrix(newMatrix)
                setPlayerTurn(true)
            })
    }

    const handleGameStart = () => {
        if(socketService.socket)
            gameService.onStartGame(socketService.socket, (options) => {
                setGameStarted(true)
                setPlayerSymbol(options.symbol)
                if(options.start)
                    setPlayerTurn(true)
                else
                    setPlayerTurn(false)
            })
    }

    const handleGameWin = () => {
        if(socketService.socket)
            gameService.onGameWin(socketService.socket, (message) => {
                setPlayerTurn(false)
                alert(message)
            })
    }

    useEffect(() => {
        handleGameUpdate()
        handleGameStart()
        handleGameWin()
    }, [])

    useEffect(() => {
        checkGameState(matrix)
    }, [matrix])

    return (
        <GameContainer>
            {!isGameStarted && <WaitMessage>Waiting to other player to join</WaitMessage>}
            {(!isGameStarted ||!isPlayerTurn) && <PlayStopper />}
            {matrix.map((row, rowIdx) => {
                return (
                    <RowContainer key={rowIdx}>
                        {row.map((column, columnIdx) => (
                            <Cell
                                key={columnIdx + rowIdx}
                                borderRight={columnIdx < 2}
                                borderLeft={columnIdx > 0}
                                borderBottom={rowIdx < 2}
                                borderTop={rowIdx > 0}
                                onClick ={() => updateGameMatrix(columnIdx, rowIdx, playerSymbol)}
                            >

                             {column && column !== 'null' ? column === 'x' ? <X /> : <O /> : null}

                            </Cell>
                        ))}
                    </RowContainer>
                )
            })}
        </GameContainer>
    )
}
