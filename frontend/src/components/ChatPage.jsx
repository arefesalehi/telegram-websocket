import React from 'react'
import MainSection from './topbar/MainSection'
import TopbarBotton from './topbar/TopbarBottom'
import TopbarTop from './topbar/TopbarTop'


const ChatPage = ({
  roomInfo,
  user,
  sendMsg,
  newMsg,
  onlineUsersCount,
  detectIsTyping,
  isTypingInfo,
  sendFile,
  newFile,
  newLocation,
  sendLocation,
}) => {

  return (
    <>
   <div className='flex flex-col w-full'>
  
      <TopbarTop
        roomInfo={roomInfo}
        onlineUsersCount={onlineUsersCount}
        user={user}
        isTypingInfo={isTypingInfo}
      />
      <MainSection
        newLocation={newLocation}
        newFile={newFile}
        roomInfo={roomInfo}
        user={user}
        newMsg={newMsg}
      />
      <TopbarBotton
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
  )
}

export default ChatPage
