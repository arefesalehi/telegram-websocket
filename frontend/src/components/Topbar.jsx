import { IoSearch } from 'react-icons/io5'
import { CiMenuKebab } from 'react-icons/ci'
import TopbarTop from './topbar/TopbarTop'
import TopbarBottom from './topbar/TopbarBottom'
import MainSection from './topbar/MainSection'
import { useTheme } from '../contexts/ThemeContext'

const Topbar = ({
  roomInfo,
  user,
  sendFile,
  sendMsg,
  newMsg,
  onlineUsersCount,
  detectIsTyping,
  isTypingInfo,
  newFile,
  newLocation,
  sendLocation,
}) => {
  const { isDark } = useTheme()

  return (
    <>
      <div
        className={`relative flex flex-col ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        } w-0 sm:w-full h-[95%]  xl:h-[96%]`}
      >
        {  roomInfo.title ? (
          <>
            <div
              className={`flex justify-between items-center ${
                isDark
                  ? 'bg-gray-800 border-gray-900'
                  : 'bg-gray-100 border-gray-300'
              }  px-3  border-b-2 w-full h-[50px]`}
            >
              <TopbarTop
                roomInfo={roomInfo}
                onlineUsersCount={onlineUsersCount}
                user={user}
                isTypingInfo={isTypingInfo}
              />
            </div>
            <MainSection
           
              newLocation={newLocation}
              newFile={newFile}
              roomInfo={roomInfo}
              user={user}
              newMsg={newMsg}
            />

            <div className="bottom-[-30px] absolute w-full">
              <TopbarBottom
                sendFile={sendFile}
                sendMsg={sendMsg}
                roomInfo={roomInfo}
                user={user}
                newMsg={newMsg}
                detectIsTyping={detectIsTyping}
                sendLocation={sendLocation}
              />
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default Topbar
