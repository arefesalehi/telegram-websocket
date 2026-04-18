
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useTheme } from '../../contexts/ThemeContext'

// رفع مشکل آیکون پیش‌فرض در leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MainSection = ({ roomInfo, user, newMsg }) => {
  const [newMessage, setNewMessage] = useState([])
  const messagesEndRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    if (newMsg.message) {
      setNewMessage((message) => [...message, newMsg])
    }
  }, [newMsg])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [roomInfo, newMessage])

  // کامپوننت نقشه برای موقعیت‌ها
  const LocationMap = ({ x, y }) => {
    const position = [y, x] // [latitude, longitude]

    return (
      <div className="rounded-lg w-full h-48 overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              موقعیت ارسالی <br />
              عرض جغرافیایی: {y} <br />
              طول جغرافیایی: {x}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    )
  }

  const formatTime = (createdAt) => {
    if (!createdAt) return ''

    const date = new Date(createdAt)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
  }

  return (
    <>
      <div className="flex flex-col px-2 pb-20 h-full overflow-y-auto scroll-smooth">
        {/* بخش پیام‌های متنی */}
        {roomInfo?.messages?.map((messageInfo, index) => {
          if (messageInfo.sender === user._id) {
            return (
              <div key={`msg-${index}`} className="flex justify-between w-full">
                <div className="w-1/3"></div>
                <div className="mx-5 my-2 min-w-0 max-w-[66%] l-auto m">
                  <p
                    className={` ${
                      isDark ? ' bg-gray-600' : 'bg-white text-black'
                    } px-2 py-2 rounded-lg break-all whitespace-normal`}
                  >
                    {messageInfo.message}
                    <p className="pt-2 text-xs text-right">
                      {' '}
                      {formatTime(messageInfo.createdAt)}
                    </p>
                  </p>
                </div>
              </div>
            )
          } else {
            return (
              <div key={`msg-${index}`} className="flex justify-between w-full">
                <div className="mx-5 my-2 mr-auto min-w-0 max-w-[66%]">
                  <p
                    className={` ${
                      isDark ? 'bg-gray-400' : 'bg-blue-500'
                    } px-2 py-2 rounded-lg break-all whitespace-normal`}
                  >
                    {messageInfo.message}
                    <p className="pt-2 text-xs text-right">
                      {' '}
                      {formatTime(messageInfo.createdAt)}
                    </p>
                  </p>
                </div>
                <div className="w-2/3"></div>
              </div>
            )
          }
        })}

        {/* بخش مدیا */}
        {roomInfo?.medias?.map((media, index) => {
          if (media.sender === user._id) {
            return (
              <div
                key={`media-${index}`}
                className="flex justify-between w-full"
              >
                <div className="w-1/3"></div>
                <div className="mx-5 my-2 min-w-0 max-w-[66%] l-auto m">
                  <div className="bg-gray-600 px-2 py-2 rounded-lg break-all whitespace-normal">
                    <img
                      src={`http://localhost:4003/${media.path}`}
                      alt="newfile"
                      className="w-[90px] h-[90px]"
                    />
                    <p className="pt-2 text-xs text-right">
                      {' '}
                      {formatTime(media.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div
                key={`media-${index}`}
                className="flex justify-between w-full"
              >
                <div className="mx-5 my-2 mr-auto min-w-0 max-w-[66%]">
                  <div className="bg-gray-400 px-2 py-2 rounded-lg break-all whitespace-normal">
                    <img
                      src={`http://localhost:4003/${media.path}`}
                      alt="newfile"
                      className="w-[90px] h-[90px]"
                    />
                      <p className="pt-2 text-xs text-right">
                      {' '}
                      {formatTime(media.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="w-2/3"></div>
              </div>
            )
          }
        })}

        {roomInfo?.locations?.map((location, index) => {
          if (location.sender === user._id) {
            return (
              <div
                key={`location-${index}`}
                className="flex justify-between w-full"
              >
                <div className="w-1/3"></div>

                <div className="mx-2 sm:mx-5 my-2 w-full min-w-0 sm:max-w-[90%] md:max-w-[80%] l-auto m">
                  <div className="bg-gray-600 px-2 py-2 rounded-lg break-all whitespace-normal">
                    <div className="p-1">
                      <LocationMap x={location.x} y={location.y} />
                      <p className="mt-1 text-gray-300 text-xs text-center">
                        📍 موقعیت ارسالی
                      </p>
                        <p className="pt-2 text-xs text-right">
                      {' '}
                      {formatTime(location.createdAt)}
                    </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div
                key={`location-${index}`}
                className="z-0 flex justify-between w-full"
              >
                <div className="mx-2 sm:mx-5 my-2 mr-auto w-full min-w-0 sm:max-w-[90%] md:max-w-[80%]">
                  <div className="bg-gray-400 px-2 py-2 rounded-lg break-all whitespace-normal">
                    <div className="p-1">
                      <LocationMap x={location.x} y={location.y} />
                      <p className="mt-1 text-gray-700 text-xs text-center">
                        📍 موقعیت ارسالی
                      </p>
                        <p className="pt-2 text-xs text-right">
                      {' '}
                      {formatTime(location.createdAt)}
                    </p>
                    </div>
                  </div>
                </div>
                <div className="w-2/3"></div>
              </div>
            )
          }
        })}

        {/* پیام‌های جدید */}
        {newMessage.map((newmessage, index) => {
          if (newmessage.sender === user._id) {
            return (
              <div key={`new-${index}`} className="flex justify-between w-full">
                <div className="w-1/3"></div>
                <div className="m-5 ml-auto min-w-0 max-w-[66%]">
                  <p className="bg-gray-600 px-2 py-2 rounded-lg break-all whitespace-normal">
                    {newmessage.message}
                  </p>
                </div>
              </div>
            )
          } else {
            return (
              <div key={`new-${index}`} className="flex justify-between w-full">
                <div className="m-5 mr-auto min-w-0 max-w-[66%]">
                  <p className="bg-gray-400 px-2 py-2 rounded-lg break-all whitespace-normal">
                    {newmessage.message}
                  </p>
                </div>
                <div className="w-2/3"></div>
              </div>
            )
          }
        })}

        <div ref={messagesEndRef}></div>
      </div>
    </>
  )
}

export default MainSection
