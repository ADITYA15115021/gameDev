import React, { useState, useEffect } from "react";
import GameOver from "./components/msg";

export default function Basic() {
  const boxSize = 400; // Game area size
  const ballSize = 30; // Ball size
  const speed = 20; // Movement speed

  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return;

      setPosition((prev) => {
        let { x, y } = prev;

        switch (event.key) {
          case "ArrowUp":
            y -= speed;
            break;
          case "ArrowDown":
            y += speed;
            break;
          case "ArrowLeft":
            x -= speed;
            break;
          case "ArrowRight":
            x += speed;
            break;
          default:
            return prev;
        }

        // Collision detection with walls
        if (x < 0 || x > boxSize - ballSize || y < 0 || y > boxSize - ballSize) {
          setGameOver(true);
          return prev;
        }

        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  const restartGame = () => {
    setPosition({ x: 50, y: 50 });
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="relative w-[400px] h-[400px] border-4 border-white bg-gray-700 rounded-lg">
        <div
          className="absolute w-[30px] h-[30px] bg-red-500 rounded-full"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        ></div>
      </div>

      {gameOver && (
        <GameOver onClickHandler={restartGame}/>
      )}
    </div>
  );
}




// <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
// bg-white p-4 rounded-lg shadow-lg text-center">
// <p className="text-lg font-bold text-black">Game Over</p>
// <button
// onClick={restartGame}
// className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
// >
// Restart
// </button>
// </div>
