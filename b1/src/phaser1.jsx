import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function Phaser1() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: { default: "arcade", arcade: { debug: false } },
      scene: { preload, create, update },
    };

    let tank, bullets, cursors, fireKey;

    function preload() {
      this.load.image("tank", "https://i.imgur.com/Oo3cZ5w.png"); // Replace with a proper tank image
      this.load.image("bullet", "https://i.imgur.com/1zXpJjo.png"); // Replace with a proper bullet image
    }

    function create() {
      tank = this.physics.add.sprite(400, 300, "tank").setScale(0.5);
      tank.setCollideWorldBounds(true);

      bullets = this.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        maxSize: 10,
        runChildUpdate: true,
      });

      cursors = this.input.keyboard.createCursorKeys();
      fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    function update() {
      if (cursors.left.isDown) {
        tank.setAngularVelocity(-150);
      } else if (cursors.right.isDown) {
        tank.setAngularVelocity(150);
      } else {
        tank.setAngularVelocity(0);
      }

      if (cursors.up.isDown) {
        this.physics.velocityFromRotation(tank.rotation, 200, tank.body.velocity);
      } else {
        tank.setVelocity(0);
      }

      if (Phaser.Input.Keyboard.JustDown(fireKey)) {
        shootBullet(this);
      }
    }

    function shootBullet(scene) {
      let bullet = bullets.get();
      if (bullet) {
        bullet
          .setTexture("bullet")
          .setPosition(tank.x, tank.y)
          .setActive(true)
          .setVisible(true);

        scene.physics.velocityFromRotation(tank.rotation, 400, bullet.body.velocity);

        setTimeout(() => bullet.setActive(false).setVisible(false), 2000);
      }
    }

    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" />;
}
