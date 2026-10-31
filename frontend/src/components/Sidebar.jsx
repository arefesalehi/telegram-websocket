/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import SidebarTop from './sidebar/SidebarTop'
import ChatFolder from './sidebar/ChatFolder'
import { useTheme } from '../contexts/ThemeContext'

const Sidebar = ({
  namespaces,
  getNamespacerooms,
  rooms,
  getRoomInfo,
  user,
}) => {
  const { isDark } = useTheme()
  const [searchText, setSearchText] = useState('')

  const filteredRooms =
    rooms?.filter((room) =>
      room.title.toLowerCase().includes(searchText.toLowerCase()),
    ) || []

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
