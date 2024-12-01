import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class LoadingScene3 extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // Type for the player object
  cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Type for the cursor keys

  constructor() {
    super('LoadingScene3');
  }

  preload() {}

  create() {
    // Přidání videa na scénu Střed obrazovky
    const video = this.add.video(0, 0, 'doors_opening');

    // Align the video to the top-left corner
    video.setOrigin(0, 0);

    // Play the video
    video.play();

    video.on('complete', () => {
      this.scene.start('Scene3'); // Spuštění další scény
    });

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start('Scene3');
  }
}
