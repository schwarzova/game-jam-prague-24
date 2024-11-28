import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Player extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // Type for the player object
  cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Type for the cursor keys

  constructor() {
    super('Player');
  }

  preload() {
    // Load player sprite
    this.load.spritesheet('player', 'assets/playerSprite.png', {
      frameWidth: 200,
      frameHeight: 470,
    });
  }

  create() {
    // Create the player character
    this.player = this.physics.add.sprite(0, 600, 'player');
    this.player.setBounce(0.2);
    // Prevent the player from leaving the game world
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // Enable arrow key input
    this.cursors = this.input.keyboard!.createCursorKeys();

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    // Reset player's velocity

    // Movement logic
    if (this.cursors.left.isDown) {
      this.player.setFlipX(true);
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setFlipX(false);
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('idle');
    }
  }

  changeScene() {
    this.scene.start('GameOver');
  }
}
