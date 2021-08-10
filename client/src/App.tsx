import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import { JoinRoom } from './components/joinRoom.component'
import GameContext, { IGameContextProps } from './contexts/game.context'
import socketService from './services/socket.service'
// import { io } from 'socket.io-client'

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
`

const WelcomeText = styled.h1`
    margin: 0;
    color: #8e44ad;
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

    const gameContextValue: IGameContextProps = {
        isInRoom,
        setInRoom,
    }

    const connectSocket = async () => {
        const socket = await socketService
            .connect('http://localhost:5000')
            .catch((err) => {
                console.log('Error:', err)
            })
    }

    useEffect(() => {
        connectSocket()
    }, [])

    return (
        <GameContext.Provider value={gameContextValue}>
            <AppContainer>
                <WelcomeText>Sup</WelcomeText>
                <MainContainer>
                    <JoinRoom />
                </MainContainer>
            </AppContainer>
        </GameContext.Provider>
    )
}

export default App
