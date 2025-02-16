

export default function GameOver({onClickHandler}){
    
    return(
        <>
          <div className="h-28 w-48 bg-black fixed top-1/2 left-1/2 text-center
             transform -translate-x-1/2 -translate-y-1/2 
            border border-black rounded-lg flex flex-col justify-evenly">
             <p className="h-1/2 text-xl text-white text-semibold
                           flex justify-center items-center">GAME OVER</p>
             <button onClick={onClickHandler}
                className="h-1/2 w-fit m-2 mx-8 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                PLAY AGAIN
             </button>
          </div>
        </>
    )
}