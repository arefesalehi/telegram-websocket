


// import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const ChatBox = ({ room, getRoomInfo }) => {
  const { isDark } = useTheme()
  const { title, image } = room

  // const navigate = useNavigate()
  //   const handleClick = () => {
  //   navigate(`/${room._id}`) // شناسه گروه رو به مسیر میدیم
  // }




  // شمارش کل پیام‌ها (متن + عکس + لوکیشن)
  const totalCount =
    (room.messages?.length || 0) +
    (room.medias?.length || 0) +
    (room.locations?.length || 0)

  // گرفتن آخرین پیام واقعی
  const getLastMessageObj = () => {
    const combined = [
      ...(room.messages || []),
      ...(room.medias || []),
      ...(room.locations || [])
    ]

    if (!combined.length) return null

    combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    return combined.at(-1)
  }

  const getLastMessageText = () => {
    const last = getLastMessageObj()
    if (!last) return " "

    if (last.message) return last.message
    if (last.path) return "📷 عکس"
    if (last.x && last.y) return "📍 موقعیت ارسال شده"
    return "پیامی وجود ندارد"
  }

  const getLastMessageTime = () => {
    const last = getLastMessageObj()
    if (!last || !last.createdAt) return ""

    const date = new Date(last.createdAt)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${hours}:${minutes}`
  }

  return (
    <div
      onClick={() => getRoomInfo(room)}
      className={`flex justify-between items-center ${
        isDark
          ? 'border-gray-600 hover:bg-green-700 bg-gray-800'
          : 'border-blue-300 hover:bg-blue-700 bg-gray-200 hover:text-white text-blue-800'
      } mx-2 px-3 border-b-1 rounded-xl w-[95%] h-[60px]`}
    >
      <div className="flex">
        <img
          src={`${image}`}
          alt="pic"
          className="rounded-[50%] w-[45px] h-[45px]"
        />

        <div className="flex flex-col px-3"  >
          <p>{title}</p>
          <p className="w-44 truncate">{getLastMessageText()}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="text-xs">{getLastMessageTime()}</span>

        {totalCount > 0 && (
          <span
            className={`flex justify-center items-center ${
              isDark ? 'bg-green-600' : 'bg-blue-400 text-white'
            } rounded-[50%] w-[20px] h-[20px] text-xs`}
          >
            {totalCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default ChatBox
