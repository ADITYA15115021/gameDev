import { useEffect, useState } from "react"


export default function P1(){
    
    const [boxPosition,setBoxPosition] = useState({x:window.innerWidth,
                                                   y:window.innerHeight-100});

    function handleKeyPress(e){
       
        if(e.key ===  "ArrowLeft"){
           setBoxPosition( (prev)=> ( { ...prev, x:Math.max(0,prev.x-20)}) ) 
        }else if(e.key === "ArrowRight"){
           setBoxPosition( (prev) => ( {...prev,x:Math.min(window.innerWidth,prev.x + 20) }  ) )
        }else if(e.key === "ArrowUp"){
            setBoxPosition( (prev) => ( {...prev,y: Math.max(0,prev.y-20)} ) )
        }else if(e.key === "ArrowDown"){
            setBoxPosition( (prev)=>( {...prev, y : Math.min(window.innerHeight,prev.y+20) } ))
        }else{
            console.log()
        }
    }   

    useEffect( ()=>{
        window.addEventListener("keydown",handleKeyPress)
    },[])                                               
    return(
        <>

         <div className="relative overflow-hidden bg-gray-800 h-screen w-screen ">
            <div className="absolute bg-red-800 h-8 w-8 rounded-full"
                 style={{ left:boxPosition.x, top:boxPosition.y }  }></div> 
         </div>
        
        

        </>
    )
}