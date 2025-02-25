

import BallGame from "./ballGame.jsx";
import Basic from './basicBall.jsx';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Emit from "./emit.jsx";
import Emit2 from "./emit2.jsx";
import P1 from "./prac/p1.jsx";
import GravitySimulation from "./gravity.jsx";


function App() {
  return (
    <BrowserRouter>
       <Routes>
           <Route path="/basic"   element={<Basic/>}></Route>
           <Route path="/ballGame" element={<BallGame/>}></Route>
           <Route path="/emit"   element={<Emit/>}></Route>
           <Route path="/emit2"   element={<Emit2/>}></Route>
          
           <Route path="/p1"     element={<P1/>}></Route>
           <Route path="/g"      element={<GravitySimulation/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;