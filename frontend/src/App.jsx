/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import '../public/css/common.css'
import '../public/css/style.css'
import Sidebar from '../../frontend/src/components/Sidebar'
import Topbar from '../src/components/Topbar'
import CloseBox from '../src/components/CloseBox'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Auth from './components/Auth'
import { Routes, Route } from 'react-router-dom'
const socket = io('http://localhost:4003')
import { Navigate, useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import { useTheme } from './contexts/ThemeContext'
import ChatPage from './components/ChatPage'

const App = () => {
  const { toggleTheme, isDark } = useTheme()
  const [namespaces, setNamespaces] = useState([])
  const [namespacesSocket, setNamespacesSocket] = useState(null)
  const [rooms, setRooms] = useState([])
  const [roomInfo, setRoomInfo] = useState({})
  const [newMsg, setNewMsg] = useState({})
  const [onlineUsersCount, setOnlineUsersCount] = useState(null)
  const [isTypingInfo, setIsTypingInfo] = useState(null)
  const [newFile, setNewFile] = useState({})
  const [newLocation, setNewLocation] = useState({})
  const [user, setUser] = useState({})

  const navigate = useNavigate()
  const isMobile = window.innerWidth < 640 // breakpoint میتونه تغییر کنه

  useEffect(() => {
    socket.on('namespaces', (namespaces) => {
      console.log(namespaces)
      setNamespaces(namespaces)
      getNamespacerooms(namespaces[0].href)
    })
  }, [])

  // حذف useEffect مربوط به theme چون در Context مدیریت می‌شود

  const getNamespacerooms = (namespacehref) => {
    if (namespacesSocket) namespacesSocket.close()
    setNamespacesSocket(io.connect(`http://localhost:4003${namespacehref}`))
  }

  useEffect(() => {
    namespacesSocket?.on('namespaceRooms', (namespaceRooms) => {
      console.log('rooms=>', namespaceRooms)
      setRooms(namespaceRooms)
    })
  }, [namespacesSocket])

  const getRoomInfo = (room) => {
    namespacesSocket.emit('joining', room.title)
    getOnlineUsersCount()
    getMsg()
    confirmIsTyping()
    getFile()
    getLocation()
    namespacesSocket.off('roomInfo')
    namespacesSocket.on('roomInfo', (roomInfo) => {
      console.log('roomInfo=>', roomInfo)
      setRoomInfo(roomInfo)
      if (isMobile) {
        navigate(`/chat/${roomInfo._id}`)
      }
    })
  }

  const sendMsg = (message, roomName, sender) => {
    namespacesSocket.emit('newMsg', { message, roomName, sender })
  }

  const getMsg = () => {
    namespacesSocket.on('confirmMsg', (data) => setNewMsg(data))
  }

  const getOnlineUsersCount = () => {
    namespacesSocket.on('onlineUsersCount', (count) =>
      setOnlineUsersCount(count),
    )
  }

  const detectIsTyping = (userID, roomName, isTyping) => {
    namespacesSocket?.emit('isTyping', { userID, roomName, isTyping })
  }

  const confirmIsTyping = () => {
    if (namespacesSocket) {
      namespacesSocket.on('isTyping', (data) => {
        setIsTypingInfo(data)
        console.log('isTyping==>', data)
      })
    }
  }

  const sendFile = (sender, roomName, file, filename) => {
    namespacesSocket.emit('newMedia', { sender, roomName, file, filename })
  }

  const getFile = () => {
    namespacesSocket.on('confirmMedia', (data) => {
      setNewFile(data)
    })
  }

  const sendLocation = (roomName, sender, location) => {
    namespacesSocket.emit('newLocation', { roomName, sender, location })
  }

  const getLocation = () => {
    namespacesSocket.on('confirmLocation', (data) => {
      setNewLocation(data)
    })
  }

  const authUser = async (token) => {
    const res = await fetch('http://localhost:4003/api/auth/me', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    if (res.status === 200) {
      const data = await res.json()
      setUser({ ...data })
      console.log('user=>', data)
    } else {
      Navigate('/auth')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      authUser(token)
    } else {
      navigate('/auth')
    }
  }, [])

  return (
    <>
      <div
        className={`  relative flex justify-center m-auto w-[100%] h-[100vh] transition-colors duration-300 ${
          isDark ? 'bg-gray-900' : 'bg-blue-300'
        }`}
      >
        <div
          className={`flex flex-col m-auto rounded-lg w-[95%] h-[90%] transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white  shadow-lg'
          }`}
        >
          <div
            className={`flex justify-end items-center px-3 w-full h-[30px] rounded-t-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-gray-100 '
            }`}
          >
            <CloseBox />
          </div>

          <div className={`flex flex-row  w-full h-[96%] ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Sidebar
                      namespaces={namespaces}
                      getNamespacerooms={getNamespacerooms}
                      rooms={rooms}
                      getRoomInfo={getRoomInfo}
                      user={user}
                    />

                    <Topbar
                      roomInfo={roomInfo}
                      user={user}
                      sendMsg={sendMsg}
                      newMsg={newMsg}
                      onlineUsersCount={onlineUsersCount}
                      detectIsTyping={detectIsTyping}
                      isTypingInfo={isTypingInfo}
                      sendFile={sendFile}
                      newFile={newFile}
                      newLocation={newLocation}
                      sendLocation={sendLocation}
                    />
                  </>
                }
              />

              <Route
                className="flex flex-col"
                path="/chat/:id"
                element={
                  <ChatPage
                    roomInfo={roomInfo}
                    user={user}
                    sendMsg={sendMsg}
                    newMsg={newMsg}
                    onlineUsersCount={onlineUsersCount}
                    detectIsTyping={detectIsTyping}
                    isTypingInfo={isTypingInfo}
                    sendFile={sendFile}
                    newFile={newFile}
                    newLocation={newLocation}
                    sendLocation={sendLocation}
                  />
                }
              />

              <Route path="/auth" element={<Auth />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* دکمه تغییر تم */}
      <button
        onClick={toggleTheme}
        className={`fixed top-2 left-0  p-3 rounded-full transition-all duration-300 ${
          isDark
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
        } shadow-lg hover:shadow-xl transform hover:scale-105`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          // آیکون خورشید برای حالت دارک
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          // آیکون ماه برای حالت لایت

          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </>
  )
}

export default App
