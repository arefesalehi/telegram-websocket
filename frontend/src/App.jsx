/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import '../public/css/common.css'
import '../public/css/style.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CloseBox from './components/CloseBox'
import Auth from './components/Auth'
import ChatPage from './components/ChatPage'
import { useTheme } from './contexts/ThemeContext'
import { API_URL } from './config'

// سوکت اصلی: فقط websocket (polling روی Render خطا می‌داد)
const socket = io(API_URL, {
  autoConnect: false,
  transports: ['websocket'],
})

const App = () => {
  const { toggleTheme, isDark } = useTheme()
  const [namespaces, setNamespaces] = useState([])
  const [rooms, setRooms] = useState([])
  const [roomInfo, setRoomInfo] = useState({})
  const [newMsg, setNewMsg] = useState({})
  const [onlineUsersCount, setOnlineUsersCount] = useState(null)
  const [isTypingInfo, setIsTypingInfo] = useState(null)
  const [newFile, setNewFile] = useState({})
  const [newLocation, setNewLocation] = useState({})
  const [user, setUser] = useState({})

  // سوکت namespace و روم فعلی توی ref نگه داشته میشن تا با هر رندر/ریکانکت قاطی نشن
  const nsSocketRef = useRef(null)
  const currentRoomRef = useRef(null)

  const navigate = useNavigate()
  const isMobile = window.innerWidth < 640 // breakpoint میتونه تغییر کنه

  useEffect(() => {
    const handleNamespaces = (list) => {
      console.log('namespaces=>', list)
      if (!Array.isArray(list) || list.length === 0) {
        setNamespaces([])
        setRooms([])
        return
      }
      // اگه همون لیست قبلیه، state عوض نشه (تب انتخاب‌شده ریست نشه)
      setNamespaces((prev) =>
        JSON.stringify(prev) === JSON.stringify(list) ? prev : list,
      )
      // فقط اگه هنوز سوکت namespace نداریم وصل شو (با ریکانکت سوکت اصلی دوباره نساز)
      if (!nsSocketRef.current) getNamespacerooms(list[0].href)
    }

    socket.on('connect_error', (error) => {
      console.error('Main socket connection failed:', error.message)
    })
    socket.on('namespaces', handleNamespaces)
    socket.connect()

    return () => {
      socket.off('namespaces', handleNamespaces)
      socket.off('connect_error')
      socket.disconnect()
      if (nsSocketRef.current) {
        nsSocketRef.current.removeAllListeners()
        nsSocketRef.current.close()
        nsSocketRef.current = null
      }
    }
  }, [])

  const getNamespacerooms = (namespacehref) => {
    if (nsSocketRef.current) {
      nsSocketRef.current.removeAllListeners()
      nsSocketRef.current.close()
    }
    currentRoomRef.current = null
    setRoomInfo({})

    const s = io(`${API_URL}${namespacehref}`, {
      autoConnect: false,
      transports: ['websocket'],
    })

    s.on('connect_error', (error) => {
      console.error('Namespace socket connection failed:', error.message)
    })

    // بعد از هر ریکانکت، سرور عضویت توی روم رو فراموش می‌کنه؛ دوباره join کن
    s.on('connect', () => {
      console.log('namespace socket connected')
      if (currentRoomRef.current) s.emit('joining', currentRoomRef.current)
    })
    s.on('disconnect', (reason) => console.warn('namespace socket disconnected:', reason))

    s.on('namespaceRooms', (namespaceRooms) => {
      console.log('rooms=>', namespaceRooms)
      setRooms(namespaceRooms)
    })
    s.on('roomInfo', (info) => {
      console.log('roomInfo=>', info)
      setRoomInfo(info)
      if (isMobile && !window.location.pathname.startsWith('/chat')) {
        navigate(`/chat/${info._id}`)
      }
    })
    s.on('onlineUsersCount', (count) => setOnlineUsersCount(count))
    s.on('confirmMsg', (data) => setNewMsg(data))
    s.on('isTyping', (data) => setIsTypingInfo(data))
    s.on('confirmMedia', (data) => setNewFile(data))
    s.on('confirmLocation', (data) => setNewLocation(data))

    nsSocketRef.current = s
    s.connect()
  }

  const getRoomInfo = (room) => {
    console.log('click room:', room.title, 'connected:', nsSocketRef.current?.connected)
    if (!nsSocketRef.current) return
    currentRoomRef.current = room.title
    setNewMsg({})
    nsSocketRef.current.emit('joining', room.title)
  }

  const sendMsg = (message, roomName, sender) => {
    nsSocketRef.current?.emit('newMsg', { message, roomName, sender })
  }

  const detectIsTyping = (userID, roomName, isTyping) => {
    nsSocketRef.current?.emit('isTyping', { userID, roomName, isTyping })
  }

  const sendFile = (sender, roomName, file, filename) => {
    nsSocketRef.current?.emit('newMedia', { sender, roomName, file, filename })
  }

  const sendLocation = (roomName, sender, location) => {
    nsSocketRef.current?.emit('newLocation', { roomName, sender, location })
  }

  const authUser = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      })

      if (res.ok) {
        const data = await res.json()
        setUser({ ...data })
        console.log('user=>', data)
      } else {
        navigate('/auth')
      }
    } catch (err) {
      console.error('authUser failed:', err)
      navigate('/auth')
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

          <div
            className={`flex flex-row  w-full h-[96%] ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}
          >
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
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
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