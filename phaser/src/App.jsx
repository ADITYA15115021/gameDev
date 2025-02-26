
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Game1 from "./game1.jsx";
function App() {
 

  return (
    <>
      <BrowserRouter>
         <Routes>
            <Route path="/game1" element={<Game1/>}></Route>
         </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
