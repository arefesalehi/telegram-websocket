// SidebarTop.jsx
import React, { useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { useTheme } from '../../contexts/ThemeContext'

const SidebarTop = ({ user, searchText, setSearchText }) => {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()
 

  return (
    <div
      className={`relative flex items-center px-4 h-[50px] ${
        isDark ? 'bg-gray-800' : 'bg-gray-100'
      }`}
    >
      {/* دکمه باز کردن منو */}
      <button
        onClick={() => setOpen(!open)}
        className={`px-5 py-2.5 rounded-lg font-medium  ${
          isDark ? 'text-white' : 'text-black'
        } text-sm`}
      >
        <IoMenu className="w-6 h-6" />
      </button>
      <input
        type="search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        id="default-search"
        className={`block ${
          isDark ? 'bg-gray-600' : 'bg-gray-200 '
        }   p-4 ps-10 border border-gray-300  rounded-lg outline-0 w-full h-[15px] text-gray-900  text-sm `}
        placeholder="Search  "
        required
      />

      {/* منوی کشویی */}
      <div
        className={`absolute top-0  left-0 z-20  ${
          isDark ? 'bg-gray-600' : 'bg-gray-300'
        }   w-[75%] h-screen shadow-lg transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* دکمه بستن */}
        <button
          onClick={() => setOpen(false)}
          className={`top-2 right-2 absolute ${
            isDark
              ? 'text-white hover:text-gray-900 '
              : 'text-black hover:text-gray-100'
          }  `}
        >
          ✕
        </button>

        {/* محتوا */}
        <div className={` ${isDark ? 'bg-gray-600' : 'bg-gray-300 '} p-4 `}>
          <h5
            className={`mb-4 font-semibold  ${
              isDark ? 'text-gray-400' : 'text-black'
            }  `}
          >
            Menu
          </h5>

          <ul className={`space-y-1  `}>
            <div
              className={`flex flex-col gap-2 border-gray-400 border-b-1 w-full ${
                isDark ? 'text-white' : 'text-black'
              } `}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2DGMiGLtZi-B3pnKJLW5c-rRtOQHXEP0DgaMZwNhZUfTL9_d9xq3NzVs&s"
                className="bg-white rounded-full w-12 h-12"
              ></img>
              <p>{user.username}</p>
              <p className="pb-2">{user.phone}</p>
            </div>

            <li
              className={`flex items-center gap-2 hover:bg-gray-400 p-2 border-gray-600 border-b-1 rounded font-bold ${
                isDark ? 'text-white' : 'text-black'
              } `}
            >
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#" className={`${isDark ? 'text-white' : 'text-black'}`}>
                My Profile
              </a>
            </li>
            <li
              className={` ${
                isDark ? 'text-white' : 'text-black'
              } flex items-center gap-2 hover:bg-gray-400  p-2 border-gray-600 border-b-1 rounded font-bold`}
            >
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#">New Group</a>
            </li>
            <li className="flex items-center gap-2 hover:bg-gray-400 p-2 border-gray-600 border-b-1 rounded font-bold">
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#">Contacts</a>
            </li>
            <li className="flex items-center gap-2 hover:bg-gray-400 p-2 border-gray-600 border-b-1 rounded font-bold">
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#">Call</a>
            </li>
            <li className="flex items-center gap-2 hover:bg-gray-400 p-2 border-gray-600 border-b-1 rounded font-bold">
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#">Seved Messages</a>
            </li>
            <li className="flex items-center gap-2 hover:bg-gray-400 dark:hover:bg-gray-700 p-2 border-gray-600 border-b-1 rounded font-bold">
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#">Settings</a>
            </li>
            <li className="flex items-center gap-2 hover:bg-gray-400 p-2 border-gray-600 border-b-1 rounded font-bold">
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#">Invite Friends</a>
            </li>
            <li className="flex items-center gap-2 hover:bg-gray-400 p-2 border-gray-600 border-b-1 rounded font-bold">
              <CgProfile
                className={`${isDark ? 'text-white' : 'text-black'}`}
              />
              <a href="#">Telegram Features</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SidebarTop
