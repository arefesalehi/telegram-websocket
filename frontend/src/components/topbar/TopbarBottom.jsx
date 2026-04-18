// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useRef, useState } from 'react'
// import { GrAttachment } from 'react-icons/gr'
// import { BsEmojiGrinFill } from 'react-icons/bs'
// import { MdKeyboardVoice, MdLocationOn } from 'react-icons/md'
// import { IoMdSend } from 'react-icons/io'
// import EmojiPicker from 'emoji-picker-react'

// const TopbarBotton = ({
//   sendMsg,
//   roomInfo,
//   user,
//   detectIsTyping,
//   sendFile,
//   sendLocation,
// }) => {
//   const [message, setMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)

//   const [showEmojiPicker, setShowEmojiPicker] = useState(false)
//   const pickerRef = useRef(null)
//   const inputRef = useRef(null)
//   const isTypingTimeout = useRef()

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (pickerRef.current && !pickerRef.current.contains(event.target)) {
//         setShowEmojiPicker(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleEmojiClick = (emojiData) => {
//     setMessage((prev) => prev + emojiData.emoji)
//     inputRef.current.focus()
//   }

//   const sendMesgHandler = (e) => {
//     e.preventDefault()
//     if (!roomInfo?.title || !user?._id) return
//     sendMsg(message, roomInfo.title, user._id)

//     // sendMsg(message, roomInfo.title, user._id)
//     setMessage('')
//   }

//   useEffect(() => {
//     console.log(isTyping)
//     detectIsTyping(user._id, roomInfo.title, isTyping)
//   }, [isTyping])

//   return (
//     <div className="relative flex justify-between items-center bg-gray-600 px-5 w-full h-[50px]">
//       <span className="flex items-center gap-2 w-full">
//         <BsEmojiGrinFill
//           className="text-white cursor-pointer"
//           onClick={() => setShowEmojiPicker((prev) => !prev)}
//         />
//         <form onSubmit={sendMesgHandler}>
//           <input
//             ref={inputRef}
//             type="text"
//             value={message}
//             onChange={(e) => {
//               setMessage(e.target.value)
//               if (!isTyping) setIsTyping(true)
//               if (isTypingTimeout) clearTimeout(isTypingTimeout.current)

//               isTypingTimeout.current = setTimeout(() => {
//                 setIsTyping(false)
//               }, 2000)
//             }}
//             // onChange={handleTyping}

//             placeholder="Write a message..."
//             className="bg-gray-600 px-3 outline-0 w-full h-[50px] text-white placeholder-gray-300"
//           />
//         </form>
//       </span>

//       <span className="flex items-center gap-3">
//         {message.trim() ? (
//           <IoMdSend className="w-5 h-5 text-green-400 cursor-pointer" />
//         ) : (
//           <>
//             <GrAttachment className="text-white cursor-pointer" />
//             <input
//               type="file"
//               className=""
//               onChange={(event) =>
//                 sendFile(user._id, roomInfo.title, event.target.files[0])
//               }
//             />

//             <MdKeyboardVoice className="w-5 h-5 text-white cursor-pointer" />
//           </>
//         )}

//         {showEmojiPicker && (
//           <div ref={pickerRef} className="bottom-[60px] left-0 z-50 absolute">
//             <EmojiPicker
//               onEmojiClick={handleEmojiClick}
//               theme="dark"
//               width={300}
//               height={400}
//             />
//           </div>
//         )}
//       </span>
//     </div>
//   )
// }

// export default TopbarBotton

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { BsEmojiGrinFill } from 'react-icons/bs'
import { MdKeyboardVoice, MdLocationOn } from 'react-icons/md'
import { IoMdSend } from 'react-icons/io'
import EmojiPicker from 'emoji-picker-react'
import { useTheme } from '../../contexts/ThemeContext'

const TopbarBotton = ({
  sendMsg,
  roomInfo,
  user,
  detectIsTyping,
  sendFile,
  sendLocation,
}) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const pickerRef = useRef(null)
  const inputRef = useRef(null)
  const isTypingTimeout = useRef()
  const fileInputRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji)
    inputRef.current.focus()
  }

  const sendMesgHandler = (e) => {
    e.preventDefault()
    if (!roomInfo?.title || !user?._id || !message.trim()) return
    sendMsg(message, roomInfo.title, user._id)
    setMessage('')
  }

  useEffect(() => {
    detectIsTyping(user._id, roomInfo.title, isTyping)
  }, [isTyping])

  // تابع برای ارسال موقعیت جغرافیایی
  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert('مرورگر شما از Geolocation پشتیبانی نمی‌کند')
      return
    }

    // نمایش پیام در حال دریافت موقعیت
    alert('در حال دریافت موقعیت شما...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          x: position.coords.longitude, // طول جغرافیایی
          y: position.coords.latitude, // عرض جغرافیایی
        }

        // ارسال موقعیت به سرور
        sendLocation(roomInfo.title, user._id, location)
        alert('موقعیت شما ارسال شد!')
      },
      (error) => {
        console.error('خطا در دریافت موقعیت:', error)
        let errorMessage = 'خطا در دریافت موقعیت'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'دسترسی به موقعیت جغرافیایی رد شد. لطفا مجوز دسترسی را فعال کنید.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'اطلاعات موقعیت در دسترس نیست.'
            break
          case error.TIMEOUT:
            errorMessage = 'دریافت موقعیت زمان‌بر شد.'
            break
        }

        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  // تابع برای ارسال فایل
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && roomInfo?.title && user?._id) {
      sendFile(user._id, roomInfo.title, file, file.name)
      // ریست کردن input فایل
      event.target.value = ''
    }
  }

  return (
    <div
      className={`relative flex justify-between items-center ${
        isDark ? 'bg-gray-600' : ' bg-white '
      }  px-5 w-full  h-[50px]    `}
    >
      <span className="flex items-center gap-2 w-full">
        <BsEmojiGrinFill
          className={` ${isDark ? 'text-white' : 'text-black'} cursor-pointer`}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        />
        <form onSubmit={sendMesgHandler} className="w-full">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (!isTyping) setIsTyping(true)
              if (isTypingTimeout.current) clearTimeout(isTypingTimeout.current)

              isTypingTimeout.current = setTimeout(() => {
                setIsTyping(false)
              }, 2000)
            }}
            placeholder="Write a message..."
            className={`00 px-3  outline-0 w-full h-[50px] ${isDark ? "text-white bg-gray-600 ":"text-black bg-white"}  placeholder-gray-300`}
          />
        </form>
      </span>

      <span className="flex items-center gap-3">
        {message.trim() ? (
          <button onClick={sendMesgHandler}>
            <IoMdSend className={`w-5 h-5  cursor-pointer ${isDark ?'text-green-400' : 'text-blue-600'}`} />
          </button>
        ) : (
          <>
            {/* دکمه ارسال فایل */}
            <div className="relative">
              <GrAttachment className={` cursor-pointer ${isDark ? 'text-white': 'text-black'}`} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>

            {/* دکمه ارسال موقعیت */}
            <MdLocationOn
              className={`w-5 h-5 ${isDark ? 'text-white': 'text-black'}  cursor-pointer`}
              onClick={handleSendLocation}
              title="ارسال موقعیت فعلی"
            />

            <MdKeyboardVoice className={`w-5 h-5 cursor-pointer ${isDark ? 'text-white': 'text-black'}`} />
          </>
        )}

        {showEmojiPicker && (
          <div ref={pickerRef} className="bottom-[60px] left-0 z-50 absolute">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              width={300}
              height={400}
              className={` ${isDark ? 'text-white': 'text-black'}`}
            />
          </div>
        )}
      </span>
    </div>
  )
}

export default TopbarBotton
