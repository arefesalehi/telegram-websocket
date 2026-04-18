import React, { useEffect, useState } from 'react'
import ChatBox from './ChatBox'
import { useTheme } from '../../contexts/ThemeContext'

const ChatFolder = ({ namespaces, getNamespacerooms, getRoomInfo, filteredRooms }) => {
  const { isDark } = useTheme()
  const [type, setType] = useState({})
  useEffect(() => {
    setType(namespaces[0])
  }, [namespaces])

  return (
    <>
      <div
        className={`flex items-center gap-4 px-5 w-full h-[40px] ${
          isDark ? '' : 'bg-gray-100'
        }`}
      >
        {namespaces.map((namespace) => {
          return (
            <span
              key={namespace._id}
              onClick={() => {
                getNamespacerooms(namespace.href)
                setType({ ...namespace })
              }}
              className={`flex items-center gap-1 border-transparent 
                ${
                  type?.title === namespace.title && isDark
                    ? 'text-green-600'
                    : ''
                } 
                ${
                  type?.title === namespace.title && !isDark
                    ? 'text-blue-600 '
                    : ''
                } 
               
              ${
                isDark ? 'hover:border-green-700' : 'hover:border-blue-700 text-black '
              }  border-b-4 h-full cursor-pointer`}
            >
              <p>{namespace.title}</p>
              <span
                className={`flex justify-center items-center ${
                  isDark ? ' bg-green-500' : ' bg-blue-500'
                } rounded-full w-4 h-4 text-white text-xs`}
              >
                2
              </span>
            </span>
          )
        })}
      </div>

      {filteredRooms.map((room) => {
        return <ChatBox key={room._id} room={room} getRoomInfo={getRoomInfo} />
      })}
    </>
  )
}

export default ChatFolder
