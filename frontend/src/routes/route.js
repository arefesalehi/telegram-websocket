import App from "../App"
import ChatPage from "../components/ChatPage"
import ChatBox from "../components/sidebar/ChatBox"

const TelegramRoute = [

    {path:'/' ,  element :<App/>},
    
    {path:'/chat/:id' ,  element :<ChatPage/>},

]
export default TelegramRoute