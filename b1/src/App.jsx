

import BallGame from "./ballGame.jsx";
import Basic from './basicBall.jsx';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Emit from "./emit.jsx";

function App() {
  return (
    <BrowserRouter>
       <Routes>
           <Route path="/basic" element={<Basic/>}></Route>
           <Route path="/ballGame" element={<BallGame/>}></Route>
           <Route path="/emit" element={<Emit/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;