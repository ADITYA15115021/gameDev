

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import skyImage from "./assets/sky.png";
import dude from "./assets/dude.png";
import ground from "./assets/platform.png";
import star from "./assets/star.png";


export default function Game1() {
  const gameRef = useRef(null);
  
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: { preload, create, update }
    };
    
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  function preload() {
    this.load.image("sky", skyImage);
    this.load.image("ground", ground);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  }

  function create() {
    // Game state
    this.gameOver = false;
    this.platformsGenerated = 0;
    this.maxPlatforms = 15; // Set how many platforms until we end the game
    this.lastPlatformReached = false;
    
    // Create repeating background
    this.bg1 = this.add.tileSprite(400, 300, 800, 600, "sky");
    this.bg1.setScrollFactor(0); // Fix background to camera
    
    // Platforms group
    this.platforms = this.physics.add.staticGroup();
    
    // Starting ground
    this.ground = this.platforms.create(400, 570, "ground").setScale(2).refreshBody();
    
    // Initial platforms - positioned for easier start
    this.platforms.create(600, 450, "ground");
    this.platforms.create(300, 350, "ground");
    
    // Player setup
    this.player = this.physics.add.sprite(400, 500, "dude");
    this.player.setBounce(0.2);
    this.player.setGravityY(800);
    this.player.setCollideWorldBounds(true);
    
    // Camera follows player
    this.cameras.main.startFollow(this.player, true, 0, 0.5);
    this.cameras.main.setDeadzone(100, 200);
    
    // Make world bounds taller for upward movement
    this.physics.world.setBounds(0, -5000, 800, 5600);

    // Animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });
    
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    
    // Game variables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.lastPlatformY = 350;
    
    // Store player's highest reached Y position
    this.highestY = this.player.y;
    
    // Set up colliders
    this.physics.add.collider(this.player, this.platforms);
  }

  function update() {
    // Update background position - slight parallax effect
    this.bg1.tilePositionY = this.cameras.main.scrollY * 0.3;
    
    // Return early if game is over
    if (this.gameOver) {
      return;
    }
    
    // Player movement
    this.player.setVelocityX(0);
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.anims.play("turn");
    }
    
    // Jump when touching ground and up arrow pressed
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-700);
    }
    
    // Track highest position reached
    if (this.player.y < this.highestY) {
      this.highestY = this.player.y;
    }

    // Generate new platforms as player approaches top of existing platforms
    if (this.player.y < this.lastPlatformY + 100 && this.platformsGenerated < this.maxPlatforms) {
      this.platformsGenerated++;
      
      // Calculate jump height - player can jump about 150-180px high
      const maxJumpHeight = 180;
      const minJumpHeight = 100;
      
      // Create 2-3 platforms per level to ensure always having options
      const platformsPerLevel = Phaser.Math.Between(2, 3);
      
      for (let i = 0; i < platformsPerLevel; i++) {
        // Position horizontally across the screen
        let x = 100 + (600 / platformsPerLevel) * i + Phaser.Math.Between(-50, 50);
        x = Phaser.Math.Clamp(x, 100, 700); // Keep platforms away from edges
        
        // Position vertically at a jumpable height
        let heightVariation = Phaser.Math.Between(minJumpHeight, maxJumpHeight);
        let y = this.lastPlatformY - heightVariation;
        
        // Make platforms slightly smaller as game progresses but not too small
        let scale = Phaser.Math.FloatBetween(0.8, 1.0);
        
        // Set the last platform flag if this is the final generation
        let platform = this.platforms.create(x, y, "ground")
          .setScale(scale, 1)
          .refreshBody();
        
        // Mark the highest platform of the last batch as the final platform
        if (this.platformsGenerated === this.maxPlatforms && i === platformsPerLevel - 1) {
          platform.isFinalPlatform = true;
        }
        
        this.lastPlatformY = Math.min(this.lastPlatformY, y);
      }
    }
    
    // Check if player reached the last platform
    if (this.player.body.touching.down && !this.lastPlatformReached) {
      const touchingPlatform = this.platforms.getChildren().find(platform => {
        return platform.isFinalPlatform && 
               this.player.body.touching.down && 
               Math.abs(this.player.y - platform.y) < 24; // Check if player is on top
      });
      
      if (touchingPlatform) {
        this.lastPlatformReached = true;
        
        // Use browser alert for winning message
        alert("YOU WON!");
        
        // Restart the game when alert is dismissed
        this.scene.restart();
      }
    }
    
    // Clean up old platforms to improve performance
    // Remove platforms that are far below the player
    this.platforms.getChildren().forEach(platform => {
      if (platform.y > this.player.y + 800 && !platform.isFinalPlatform && platform !== this.ground) {
        platform.destroy();
      }
    });
    
    // Game over if player falls below the camera view
    if (this.player.y > this.cameras.main.scrollY + 650) {
      this.gameOver = true;
      
      // Use browser alert for game over message
      alert("GAME OVER!");
      
      // Restart the game when alert is dismissed
      this.scene.restart();
    }
  }

  return <div ref={gameRef} />;
}








