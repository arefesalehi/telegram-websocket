import { IoSearch } from 'react-icons/io5'
import { CiMenuKebab } from 'react-icons/ci'
import { useTheme } from '../../contexts/ThemeContext'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const TopbarTop = ({ roomInfo, onlineUsersCount, isTypingInfo, user }) => {
  console.log('onlineUsersCount=>', onlineUsersCount)
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const isMobile = window.innerWidth < 640 

  const backHandler = () => {
    navigate('/')
  }

  return (
    <>
      <div
        className={`  flex justify-between items-center ${
          isDark ? 'bg-gray-800' : 'bg-gray-100 '
        }  px-5 w-full h-[50px]  `}
      >
        <div className="flex justify-center items-center gap-5 pb-2">
          {isMobile ? (
            <IoMdArrowRoundBack
              onClick={backHandler}
              className={`  ${isDark ? ' ' : 'text-black'}`}
            />
          ) : ''}

          <img
            src={`${roomInfo.image}`}
            className="bg-red-500 rounded-[50%] w-[35px] h-[35px]"
          />
          <div className="flex-col felx">
            <p className={`${isDark ? 'text-white' : ' text-black'}`}>
              {roomInfo.title}
            </p>
            <p className={` ${isDark ? 'text-green-400' : 'text-blue-600'}`}>
              {isTypingInfo &&
              isTypingInfo.username !== user.username &&
              isTypingInfo.isTyping
                ? `${isTypingInfo.username} is Typing...  `
                : ` ${onlineUsersCount} user online`}
            </p>
          </div>
        </div>

        <div className={`flex gap-4 ${isDark ? 'text-white' : ' text-black'}`}>
          <IoSearch />
          <CiMenuKebab />
        </div>
      </div>
    </>
  )
}

export default TopbarTop
