import { Boot } from './scenes/Boot';
import { FirstCut } from './scenes/FirstCut';
import { Room1 } from './scenes/Room1';
import { Room4 } from './scenes/Room4';
import { LoadingScene3 } from './scenes/LoadingScene3';
import { Scene3 } from './scenes/Scene3';
import { MainMenu } from './scenes/MainMenu';
import { CANVAS, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: CANVAS,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scene: [
    Boot,
    Preloader,
    MainMenu,
    FirstCut,
    Room1,
    LoadingScene3,
    Scene3,
    Room4,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
