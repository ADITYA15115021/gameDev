import { useState, useEffect, useRef } from 'react';

const GravitySimulation = () => {
  // Physics constants
  const GRAVITY = 0.5;
  const BOUNCE_FACTOR = 0.7; // Energy loss on bounce (0-1)
  const FRICTION = 0.99; // Horizontal friction
  const FLOOR_Y = 400; // Y position of the floor
  const BALL_RADIUS = 20;
  const JUMP_VELOCITY = -15; // Negative because y increases downward

  // Ball state
  const [position, setPosition] = useState({ x: 200, y: FLOOR_Y - BALL_RADIUS });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  //const [jumpsCount, setJumpsCount] = useState(0);
  
  // Animation reference
  const animationRef = useRef(null);
  
  // Game loop
  useEffect(() => {
    if (!isMoving) return;
    
    const updatePhysics = () => {
      setPosition(prevPos => {
        setVelocity(prevVel => {
          let newVelX = prevVel.x * FRICTION;
          let newVelY = prevVel.y + GRAVITY; // Apply gravity
          
          let newPosX = prevPos.x + newVelX;
          let newPosY = prevPos.y + newVelY;
          
          // Floor collision
          if (newPosY > FLOOR_Y - BALL_RADIUS) {
            newPosY = FLOOR_Y - BALL_RADIUS;
            newVelY = -prevVel.y * BOUNCE_FACTOR; // Reverse velocity with energy loss
            
            // Stop if movement becomes negligible
            if (Math.abs(newVelY) < 0.5 && Math.abs(newVelX) < 0.2) {
              setIsMoving(false);
              newVelY = 0;
              newVelX = 0;
            }
          }
          
          // Wall collisions (left and right)
          // if (newPosX < BALL_RADIUS) {
          //   newPosX = BALL_RADIUS;
          //   newVelX = -prevVel.x * BOUNCE_FACTOR;
          // } else if (newPosX > 400 - BALL_RADIUS) {
          //   newPosX = 400 - BALL_RADIUS;
          //   newVelX = -prevVel.x * BOUNCE_FACTOR;
          // }
          
          return { x: newVelX, y: newVelY };
        });
        
        return {
          x: prevPos.x + velocity.x,
          y: prevPos.y + velocity.y
        };
      });
      
      animationRef.current = requestAnimationFrame(updatePhysics);
    };
    
    animationRef.current = requestAnimationFrame(updatePhysics);
    
    // Cleanup animation frame on unmount or when isMoving changes
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMoving, velocity]);

  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (position.y >= FLOOR_Y - BALL_RADIUS - 1) { // Only jump if on or very close to floor
          setVelocity(prev => ({ ...prev, y: JUMP_VELOCITY }));
          setIsMoving(true);
          setJumpsCount(prev => prev + 1);
        }
        
        // Add some random horizontal movement for more interesting bounces
        // if (!isMoving) {
        //   const randomX = (Math.random() - 0.5) * 6;
        //   setVelocity(prev => ({ x: randomX, y: JUMP_VELOCITY }));
        //   setIsMoving(true);
        // }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position.y, isMoving]);
  
  // Handle button press (alternative to spacebar)
  const handleJumpClick = () => {
    if (position.y >= FLOOR_Y - BALL_RADIUS - 1) {
      const randomX = (Math.random() - 0.5) * 6;
      setVelocity({ x: randomX, y: JUMP_VELOCITY });
      setIsMoving(true);
      setJumpsCount(prev => prev + 1);
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bouncing Ball Simulation</h2>
      <div className="relative w-full h-96 bg-blue-100 rounded-lg overflow-hidden border-2 border-gray-300 mb-4">
        {/* Ball */}
        <div 
          className="absolute bg-red-500 rounded-full shadow-lg transition-colors"
          style={{
            width: BALL_RADIUS * 2,
            height: BALL_RADIUS * 2,
            left: position.x - BALL_RADIUS,
            top: position.y - BALL_RADIUS,
            backgroundColor: isMoving ? 'rgb(239, 68, 68)' : 'rgb(220, 38, 38)',
            boxShadow: `0px ${isMoving ? 8 : 4}px 8px rgba(0,0,0,0.2)`
          }}
        />
        
        {/* Floor */}
        <div 
          className="absolute bottom-0 w-full h-8 bg-gray-800"
          style={{ top: FLOOR_Y }}
        />
        </div>
      
      <div className="flex flex-col items-center space-y-4">
        <button 
          onClick={handleJumpClick}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Jump!
        </button>
        
        {/* <div className="text-lg text-gray-700">
          <p>Press <span className="font-mono bg-gray-200 px-2 py-1 rounded">Spacebar</span> to make the ball jump</p>
          <p className="mt-2">Jumps: {jumpsCount}</p>
          <p>Status: {isMoving ? 'Moving' : 'At rest'}</p>
        </div> */}
      </div>
    </div>
  );
};

export default GravitySimulation;















