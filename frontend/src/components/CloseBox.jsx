import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { FaRegWindowRestore } from 'react-icons/fa'

import { FaWindowMinimize } from 'react-icons/fa6'
import { useTheme } from '../contexts/ThemeContext'

const CloseBox = () => {
  const { isDark } = useTheme() 
  
  return (
    <div className={`flex gap-3 ${isDark ? 'text-white' :'text-black'}  text-right  `}>
      <FaWindowMinimize />
      <FaRegWindowRestore />

      <IoMdClose />
    </div>
  )
}

export default CloseBox
