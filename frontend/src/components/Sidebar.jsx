/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import SidebarTop from './sidebar/SidebarTop'
import ChatFolder from './sidebar/ChatFolder'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { API_URL } from '../config'

const Sidebar = ({
  namespaces,
  getNamespacerooms,
  rooms,
  getRoomInfo,
  user,
}) => {
  const { isDark } = useTheme()
  const [setUser] = useState({})
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  const filteredRooms =
    rooms?.filter((room) =>
      room.title.toLowerCase().includes(searchText.toLowerCase()),
    ) || []

  const authUser = async (token) => {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    if (res.status === 200) {
      const data = await res.json()
      setUser({ ...data })
    } else {
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
    <div
      className={`relative ${
        isDark
          ? ' bg-gray-800 border-gray-900 '
          : ' bg-gray-100 border-gray-300 '
      } border-r lg:w-[40%] w-full sm:w-[70%] md:w-[60%] h-full overflow-hidden `}
    >
      <SidebarTop
        user={user}
        searchText={searchText}
        setSearchText={setSearchText}
        rooms={rooms}
      />
      <ChatFolder
        namespaces={namespaces}
        getNamespacerooms={getNamespacerooms}
        rooms={rooms}
        getRoomInfo={getRoomInfo}
        filteredRooms={filteredRooms}
      />
    </div>
  )
}

export default Sidebar
