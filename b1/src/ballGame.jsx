import { useState, useEffect, useCallback } from "react";

export default function BallGame() {
  const numObjects = 50; // Number of falling objects
  const ballSize = 30;
  const objectSize = 24;

  // Ball state
  const [ball, setBall] = useState({
    left: window.innerWidth / 2,
    top: window.innerHeight - 60, // Near the bottom
  });

  // Obstacles state
  const [objects, setObjects] = useState(
    Array.from({ length: numObjects }, () => ({
      left: Math.random() * window.innerWidth,
      top: 0,
      speed: Math.random() * 2 + 1,
    }))
  );

  const [gameOver, setGameOver] = useState(false);

  // Move ball left/right
  const moveBall = useCallback((e) => {
    if (gameOver) return;

    setBall((prev) => {
      let newLeft = prev.left;
      if (e.key === "ArrowLeft") newLeft = Math.max(0, prev.left - 20);
      if (e.key === "ArrowRight") newLeft = Math.min(window.innerWidth - ballSize, prev.left + 20);
      return { ...prev, left: newLeft };
    });
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", moveBall);
    return () => window.removeEventListener("keydown", moveBall);
  }, [moveBall]);

  // Obstacle movement & collision detection
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObjects((prevObjects) =>
        prevObjects.map((obj) => {
          const newTop = obj.top >= window.innerHeight ? 0 : obj.top + obj.speed;
          const newLeft = obj.top >= window.innerHeight ? Math.random() * window.innerWidth : obj.left;

          // Check for collision
          const ballCenterX = ball.left + ballSize / 2;
          const ballCenterY = ball.top + ballSize / 2;
          const objCenterX = obj.left + objectSize / 2;
          const objCenterY = obj.top + objectSize / 2;

          const distX = Math.abs(ballCenterX - objCenterX);
          const distY = Math.abs(ballCenterY - objCenterY);
          const minDist = (ballSize + objectSize) / 2;

          if (distX < minDist && distY < minDist) {
            setGameOver(true);
          }

          return { ...obj, top: newTop, left: newLeft };
        })
      );
    }, 20);

    return () => clearInterval(interval);
  }, [ball, gameOver]);

  function gameOverHandler(){

    setGameOver(false);
              setBall({ left: window.innerWidth / 2, top: window.innerHeight - 60 });
              setObjects(Array.from({ length: numObjects }, () => ({
                left: Math.random() * window.innerWidth,
                top: 0,
                speed: Math.random() * 2 + 1,
              })));

  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-800">
      {/* Ball */}
      <div
        className="absolute w-8 h-8 bg-red-500 rounded-full"
        style={{ top: ball.top, left: ball.left }}
      />

      {/* Obstacles */}
      {objects.map((obj, index) => (
        <div
          key={index}
          className="absolute w-6 h-6 bg-blue-500 rounded-full"
          style={{ top: obj.top, left: obj.left }}
        />
      ))}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <p className="text-white text-2xl font-bold">Game Over</p>
          <button
            onClick={gameOverHandler}
            className="mt-4 px-6 py-2 bg-white text-black rounded-lg"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}







// import { useState, useEffect } from "react";

// export default function Game() {
//   const numObjects = 5; // Number of falling objects
//   const [objects, setObjects] = useState(
//     Array.from({ length: numObjects }, () => ({
//       left: Math.random() * window.innerWidth,
//       top: 0,
//       speed: Math.random() * 2 + 1,
//     }))
//   );
//   const [ballPosition, setBallPosition] = useState(window.innerWidth / 2);
//   const [gameOver, setGameOver] = useState(false);
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setObjects((prevObjects) =>
//         prevObjects.map((obj) => {
//           const newTop = obj.top >= window.innerHeight ? 0 : obj.top + obj.speed;
//           const newLeft = obj.top >= window.innerHeight ? Math.random() * window.innerWidth : obj.left;

//           // Collision detection
//           const ballSize = 30;
//           if (
//             newTop + 24 >= window.innerHeight - 50 &&
//             Math.abs(newLeft - ballPosition) < ballSize
//           ) {
//             setGameOver(true);
//           }

//           return { ...obj, top: newTop, left: newLeft };
//         })
//       );
//     }, 20);

//     return () => clearInterval(interval);
//   }, [ballPosition]);

//   useEffect(() => {
//     if (!gameOver) {
//       const timer = setInterval(() => {
//         setScore((prev) => prev + 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [gameOver]);

//   const handleKeyDown = (e) => {
//     if (e.key === "ArrowLeft") {
//       setBallPosition((prev) => Math.max(0, prev - 20));
//     } else if (e.key === "ArrowRight") {
//       setBallPosition((prev) => Math.min(window.innerWidth - 30, prev + 20));
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   return (
//     <div className="relative w-screen h-screen overflow-hidden bg-gray-800">
//       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold">
//         Score: {score}
//       </div>
//       {objects.map((obj, index) => (
//         <div
//           key={index}
//           className="absolute w-6 h-6 bg-blue-500 rounded-full"
//           style={{ top: obj.top, left: obj.left }}
//         />
//       ))}
//       <div
//         className="absolute w-8 h-8 bg-red-500 rounded-full"
//         style={{ left: ballPosition, bottom: "50px" }}
//       />
//       {gameOver && (
//         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg text-center">
//           <p className="text-lg font-bold text-black">Game Over</p>
//           <button
//             onClick={() => {
//               setGameOver(false);
//               setScore(0);
//               setObjects(
//                 Array.from({ length: numObjects }, () => ({
//                   left: Math.random() * window.innerWidth,
//                   top: 0,
//                   speed: Math.random() * 2 + 1,
//                 }))
//               );
//             }}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//           >
//             Restart
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


