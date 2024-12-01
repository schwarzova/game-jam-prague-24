import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class FirstCut extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // Type for the player object
  cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Type for the cursor keys

  constructor() {
    super('FirstCut');
  }

  preload() {
    this.load.image('skipButton', 'assets/dummy/skipButton.png');
    this.load.audio('bgMusic', 'assets/music/bgMusic.mp3');
  }

  create() {
    // Přidání videa na scénu Střed obrazovky
    const video = this.add.video(0, 0, 'cutsceneVideo');

    // Align the video to the top-left corner
    video.setOrigin(0, 0);

    // Play the video
    video.play();

    video.on('complete', () => {
      this.scene.start('Room1'); // Spuštění další scény
    });

    const skipButton = this.add.image(1000, 750, 'skipButton').setInteractive(); // Tlačítko v pravém dolním rohu
    skipButton.setScale(0.1); // Nastavení velikosti tlačítka

    // Akce po kliknutí na tlačítko „Skip“
    skipButton.on('pointerdown', () => {
      video.stop(); // Zastaví video
      this.scene.start('Room1'); // Přechod na další scénu
    });

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start('Room1');
  }
}
