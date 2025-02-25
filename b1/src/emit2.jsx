import { useState, useEffect, useRef } from "react";

export default function Emit() {
  const [ballPosition, setBallPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [angle, setAngle] = useState(0);
  const [projectiles, setProjectiles] = useState([]);
  const animationRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setAngle((prev) => prev - 10);
    } else if (e.key === "ArrowRight") {
      setAngle((prev) => prev + 10);
    } else if (e.key === "ArrowUp") {
      setBallPosition((prev) => ({
        x: prev.x + 10 * Math.cos((angle * Math.PI) / 180),
        y: prev.y + 10 * Math.sin((angle * Math.PI) / 180),
      }));
    } else if (e.key === "ArrowDown") {
      setBallPosition((prev) => ({
        x: prev.x - 10 * Math.cos((angle * Math.PI) / 180),
        y: prev.y - 10 * Math.sin((angle * Math.PI) / 180),
      }));
    } else if (e.key === " ") {
      setProjectiles((prev) => [
        ...prev,
        {
          x: ballPosition.x + 20 * Math.cos((angle * Math.PI) / 180), // Start from the cannon
          y: ballPosition.y + 20 * Math.sin((angle * Math.PI) / 180),
          angle: angle,
        },
      ]);
    }
  };

  const updateProjectiles = () => {
    setProjectiles((prev) =>
      prev
        .map((proj) => ({
          x: proj.x + 5 * Math.cos((proj.angle * Math.PI) / 180),
          y: proj.y + 5 * Math.sin((proj.angle * Math.PI) / 180),
          angle: proj.angle,
        }))
        .filter((proj) => proj.x > 0 && proj.x < window.innerWidth && proj.y > 0 && proj.y < window.innerHeight)
    );
    animationRef.current = requestAnimationFrame(updateProjectiles);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    animationRef.current = requestAnimationFrame(updateProjectiles);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationRef.current);
    };
  }, [ballPosition, angle]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-800">
      {/* Tank Base */}
      <div
        className="absolute w-12 h-12 bg-red-500 rounded-lg"
        style={{
          left: ballPosition.x,
          top: ballPosition.y,
          transform: `rotate(${angle}deg)`,
        }}
      >
        {/* Cannon */}
        <div
          className="absolute w-16 h-4 bg-black rounded-md"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -100%) rotate(0deg)", // Position the cannon correctly
            transformOrigin: "center bottom",
          }}
        />
      </div>

      {/* Projectiles */}
      {projectiles.map((proj, index) => (
        <div
          key={index}
          className="absolute w-3 h-3 bg-yellow-500 rounded-full"
          style={{ left: proj.x, top: proj.y }}
        />
      ))}
    </div>
  );
}
