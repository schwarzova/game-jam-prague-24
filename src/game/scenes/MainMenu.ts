import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  logoTween: Phaser.Tweens.Tween | null;

  constructor() {
    super('MainMenu');
  }

  create() {
    // Přidání videa na scénu Střed obrazovky
    const video = this.add.video(0, 0, 'mainMenuVideo');

    // Align the video to the top-left corner
    video.setOrigin(0, 0);

    // Play the video
    video.play(true);
    video.setInteractive();

    video.on('pointerdown', () => {
      this.scene.start('FirstCut');
    });

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start('FirstCut');
  }
}
