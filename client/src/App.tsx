import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import {io} from 'socket.io-client'

function App() {
    const connect = () => {
      const socket = io('http://localhost:5000')
    }

    useEffect(() => {
        connect()
    }, [])

    return <h1>Sup</h1>
}

export default App
