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
    this.load.video('cutsceneVideo', 'assets/dummy/firstCut.mp4');
    this.load.image('skipButton', 'assets/dummy/skipButton.png');
  }

  create() {
    // Přidání videa na scénu Střed obrazovky
    const video = this.add.video(512, 334, 'cutsceneVideo');

    video.play();
    video.setDisplaySize(1024, 768); // Rozměry obrazovky

    video.on('complete', () => {
      this.scene.start('Game'); // Spuštění další scény
    });

    const skipButton = this.add.image(1000, 750, 'skipButton').setInteractive(); // Tlačítko v pravém dolním rohu
    skipButton.setScale(0.1); // Nastavení velikosti tlačítka

    // Akce po kliknutí na tlačítko „Skip“
    skipButton.on('pointerdown', () => {
      video.stop(); // Zastaví video
      this.scene.start('Game'); // Přechod na další scénu
    });

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start('Room1');
  }
}
