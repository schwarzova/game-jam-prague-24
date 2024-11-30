import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { FirstCut } from './scenes/FirstCut';
import { Player } from './scenes/Player';
import { Room1 } from './scenes/Room1';
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
    MainGame,
    Player,
    GameOver,
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
