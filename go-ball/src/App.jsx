import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const App = () => {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    let isJumping = false;
    let jumpVelocity = 0;
    const gravity = -0.015;
    let obstacleSpeed = 0.1;
    let animationFrameId;
    let obstacles = [];

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    mountRef.current.appendChild(renderer.domElement);

    // Ball (player)
    const ballGeometry = new THREE.SphereGeometry(0.5);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.y = 0;
    ball.position.z = 0;
    scene.add(ball);

    // Ground
    const groundGeometry = new THREE.BoxGeometry(100, 0.5, 5);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -2;
    scene.add(ground);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Camera position
    camera.position.z = 10;
    camera.position.y = 2;

    // Obstacle creation function
    const createObstacle = () => {
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const obstacle = new THREE.Mesh(geometry, material);
      obstacle.position.x = 15;
      obstacle.position.y = -1.25;
      scene.add(obstacle);
      obstacles.push(obstacle);
    };

    // Jump function
    const jump = () => {
      if (!isJumping && !gameOver) {
        isJumping = true;
        jumpVelocity = 0.3;
      }
    };

    // Handle keypress
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        jump();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Create initial obstacle
    createObstacle();

    // Animation loop
    const animate = () => {
      if (!gameOver) {
        // Update ball position (jumping)
        if (isJumping) {
          ball.position.y += jumpVelocity;
          jumpVelocity += gravity;

          if (ball.position.y <= 0) {
            ball.position.y = 0;
            isJumping = false;
          }
        }

        // Update obstacles
        obstacles.forEach((obstacle, index) => {
          obstacle.position.x -= obstacleSpeed;

          // Check collision
          if (Math.abs(obstacle.position.x - ball.position.x) < 0.8 &&
              Math.abs(obstacle.position.y + 1.25 - ball.position.y) < 1) {
            setGameOver(true);
          }

          // Remove obstacle if it's off screen
          if (obstacle.position.x < -15) {
            scene.remove(obstacle);
            obstacles.splice(index, 1);
          }
        });

        // Create new obstacle
        if (obstacles.length < 2 && Math.random() < 0.02) {
          createObstacle();
        }

        // Update score
        setScore(prev => prev + 1);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      cancelAnimationFrame(animationFrameId);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [gameOver]);

  // Handle restart
  const handleRestart = () => {
    setHighScore(prev => Math.max(prev, score));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white text-xl mb-4">
        Score: {score} | High Score: {highScore}
      </div>
      <div ref={mountRef} className="border-4 border-white rounded-lg overflow-hidden" />
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-black bg-opacity-80 p-8 rounded-lg text-center">
          <h2 className="text-white text-3xl mb-4">Game Over!</h2>
          <p className="text-white mb-4">Final Score: {score}</p>
          <button
            onClick={handleRestart}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            Play Again
          </button>
        </div>
      )}
      <div className="text-white mt-4 text-center">
        <p>Press SPACE to jump</p>
      </div>
    </div>
  );
};

export default App;

