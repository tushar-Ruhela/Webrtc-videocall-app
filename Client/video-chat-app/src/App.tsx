import { Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import Room from "./pages/Room"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Mainfrontpage from "./pages/Mainfrontpage"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Services from "./pages/Services"
import Pricing from "./pages/Pricing"



const App = () => {
  return (
    <div>
<Routes>
  <Route path="/" element={<Mainfrontpage/>}/>
  <Route path="/about" element={<About/>}/>
   <Route path="/contact" element={<Contact/>}/>
<Route path="/services" element={<Services/>}/>
<Route path="/pricing" element={<Pricing/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/room/:roomId" element={<Room/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
</Routes>

    </div>
  )
}

export default App


