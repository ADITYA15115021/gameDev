

// import { useState, useEffect } from "react";

// export default function Emit() {
//   const [ballPosition, setBallPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 100 });
//   const [projectiles, setProjectiles] = useState([]);

//   const handleKeyDown = (e) => {
//     if (e.key === "ArrowLeft") {
//       setBallPosition((prev) => ({ ...prev, x: Math.max(0, prev.x - 20) }));
//     } else if (e.key === "ArrowRight") {
//       setBallPosition((prev) => ({ ...prev, x: Math.min(window.innerWidth - 30, prev.x + 20) }));
//     } else if (e.key === "ArrowUp") {
//       setBallPosition((prev) => ({ ...prev, y: Math.max(0, prev.y - 20) }));
//     } else if (e.key === "ArrowDown") {
//       setBallPosition((prev) => ({ ...prev, y: Math.min(window.innerHeight - 50, prev.y + 20) }));
//     } else if (e.key === " ") {
//       setProjectiles((prev) => [
//         ...prev,
//         { x: ballPosition.x + 10, y: ballPosition.y - 10 } // Start slightly above the ball
//       ]);
//     }
//   };

//   useEffect(() => {
//     const moveProjectiles = setInterval(() => {
//       setProjectiles((prev) =>
//         prev
//           .map((proj) => ({ ...proj, y: proj.y - 5 }))
//           .filter((proj) => proj.y > 0)
//       );
//     }, 20);
//     return () => clearInterval(moveProjectiles);
//   }, []);

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [ballPosition]);

//   return (
//     <div className="relative w-screen h-screen overflow-hidden bg-gray-800">
//       <div
//         className="absolute w-8 h-8 bg-red-500 rounded-full"
//         style={{ left: ballPosition.x, top: ballPosition.y }}
//       />
//       {projectiles.map((proj, index) => (
//         <div
//           key={index}
//           className="absolute w-2 h-6 bg-yellow-500"
//           style={{ left: proj.x, top: proj.y }}
//         />
//       ))}
//     </div>
//   );
// }

import { useState, useEffect } from "react";

export default function Game() {
  const [ballPosition, setBallPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 100 });
  const [projectiles, setProjectiles] = useState([]);
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    const spawnEnemy = setInterval(() => {
      setEnemies((prev) => [
        ...prev,
        { x: Math.random() * window.innerWidth, y: 0, id: Math.random() }
      ]);
    }, 1000);
    return () => clearInterval(spawnEnemy);
  }, []);

  useEffect(() => {
    const moveEnemies = setInterval(() => {
      setEnemies((prev) => prev.map(enemy => ({ ...enemy, y: enemy.y + 3 })).filter(enemy => enemy.y < window.innerHeight));
    }, 20);
    return () => clearInterval(moveEnemies);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setBallPosition((prev) => ({ ...prev, x: Math.max(0, prev.x - 20) }));
    } else if (e.key === "ArrowRight") {
      setBallPosition((prev) => ({ ...prev, x: Math.min(window.innerWidth - 30, prev.x + 20) }));
    } else if (e.key === "ArrowUp") {
      setBallPosition((prev) => ({ ...prev, y: Math.max(0, prev.y - 20) }));
    } else if (e.key === "ArrowDown") {
      setBallPosition((prev) => ({ ...prev, y: Math.min(window.innerHeight - 50, prev.y + 20) }));
    } else if (e.key === " ") {
      setProjectiles((prev) => [...prev, { x: ballPosition.x + 10, y: ballPosition.y - 10 }]);
    }
  };

  useEffect(() => {
    const moveProjectiles = setInterval(() => {
      setProjectiles((prev) =>
        prev.map((proj) => ({ ...proj, y: proj.y - 5 })).filter((proj) => proj.y > 0)
      );
    }, 20);
    return () => clearInterval(moveProjectiles);
  }, []);

  useEffect(() => {
    const checkCollisions = () => {
      setEnemies((prevEnemies) => prevEnemies.filter(enemy =>
        !projectiles.some(proj =>
          proj.x < enemy.x + 20 && proj.x + 2 > enemy.x &&
          proj.y < enemy.y + 20 && proj.y + 6 > enemy.y
        )
      ));
    };
    checkCollisions();
  }, [projectiles]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ballPosition]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-800">
      <div className="absolute w-8 h-8 bg-red-500 rounded-full" style={{ left: ballPosition.x, top: ballPosition.y }} />
      {projectiles.map((proj, index) => (
        <div key={index} className="absolute w-2 h-6 bg-yellow-500" style={{ left: proj.x, top: proj.y }} />
      ))}
      {enemies.map((enemy) => (
        <div key={enemy.id} className="absolute w-8 h-8 bg-green-500 rounded-full" style={{ left: enemy.x, top: enemy.y }} />
      ))}
    </div>
  );
}

