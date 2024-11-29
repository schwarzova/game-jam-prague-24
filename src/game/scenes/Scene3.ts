import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Scene3 extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameText: Phaser.GameObjects.Text;

  constructor() {
    super('Scene3');
  }

  create() {
      EventBus.emit('current-scene-ready', this);
  }

    changeScene() {
        this.scene.start('GameOver');
    }

}
