

import { useState, useEffect } from "react";

export default function Emit() {
  const [ballPosition, setBallPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 100 });
  const [projectiles, setProjectiles] = useState([]);

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
      setProjectiles((prev) => [
        ...prev,
        { x: ballPosition.x + 10, y: ballPosition.y - 10 } // Start slightly above the ball
      ]);
    }
  };

  useEffect(() => {
    const moveProjectiles = setInterval(() => {
      setProjectiles((prev) =>
        prev
          .map((proj) => ({ ...proj, y: proj.y - 5 }))
          .filter((proj) => proj.y > 0)
      );
    }, 20);
    return () => clearInterval(moveProjectiles);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ballPosition]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-800">
      <div
        className="absolute w-8 h-8 bg-red-500 rounded-full"
        style={{ left: ballPosition.x, top: ballPosition.y }}
      />
      {projectiles.map((proj, index) => (
        <div
          key={index}
          className="absolute w-2 h-6 bg-yellow-500"
          style={{ left: proj.x, top: proj.y }}
        />
      ))}
    </div>
  );
}
