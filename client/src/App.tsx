import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import { Game } from './components/game.component'
import { JoinRoom } from './components/joinRoom.component'
import GameContext, { IGameContextProps } from './contexts/game.context'
import socketService from './services/socket.service'


const AppContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
`

const WelcomeText = styled.h1`
    margin: 0;
    color: black;
`
const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`
function App() {
    const [isInRoom, setInRoom] = useState(false)
    const [playerSymbol, setPlayerSymbol] = useState<'x' | 'o'>('x')
    const [isPlayerTurn, setPlayerTurn] = useState(false)
    const [isGameStarted, setGameStarted] = useState(false)


    const connectSocket = async () => {
        await socketService
            .connect('http://localhost:5000')
            .catch((err) => {
                console.log('Error:', err)
            })
    }

    useEffect(() => {
        connectSocket()
    }, [])

    const gameContextValue: IGameContextProps = {
        isInRoom,
        setInRoom,
        playerSymbol,
        setPlayerSymbol,
        isPlayerTurn,
        setPlayerTurn,
        isGameStarted,
        setGameStarted
    }

    return (
        <GameContext.Provider value={gameContextValue}>
            <AppContainer>
                <WelcomeText>Tic-Tac-Toe</WelcomeText>
                <MainContainer>
                    { !isInRoom && <JoinRoom />}
                    { isInRoom && <Game />}
                </MainContainer>
            </AppContainer>
        </GameContext.Provider>
    )
}

export default App
