import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import {
  createRect,
  handleRectClick,
  handleRectOut,
  handleRectOver,
} from '../helpers/pathRect';

export class Room1 extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Type for the cursor keys
  hero: Phaser.Physics.Arcade.Sprite;
  target: Phaser.Math.Vector2;
  // Dialog system
  dialogueText: Phaser.GameObjects.Text; // Text object for dialogue
  capeManDialogueText: Phaser.GameObjects.Text; // Text object for dialogue
  // sounds
  soundEffect: Phaser.Sound.BaseSound;

  constructor() {
    super('Room1');
  }

  preload() {
    // Load player image
    this.load.image(
      'backgroundRoom1',
      'assets/background/bacground_basement.png',
    );
    this.load.image('hero', 'assets/hero/hero.png');
    this.load.image('capeMan', 'assets/dummy/capeMan.png');
    this.load.audio('capeManSound', 'assets/dummy/Room1CapeMan.mp3');
    this.load.image('stepsCursor', 'assets/dummy/stepsCursor.cur');
    // this.load.image('pointCursor', 'assets/dummy/custom-cursor.png');
  }

  create() {
    this.add
      .image(1024, 768, 'backgroundRoom1')
      .setScrollFactor(1)
      .setOrigin(1, 1);
    // Nakreslení cesty 0xff0000 transparent
    const rect3 = createRect(this, 200, 450, 800, 300);
    const rect4 = createRect(this, 0, 250, 340, 400);

    // Create the player character
    this.hero = this.physics.add.sprite(812, 484, 'hero').setOrigin(0.5, 0.9);
    this.hero.setScale(0.7);
    // this.hero.setCollideWorldBounds(true);

    // Enable camera follow on the player
    this.cameras.main.startFollow(this.hero);

    // Set camera bounds to the size of the world
    this.cameras.main.setBounds(0, 0, 3000, 768); // Adjust world size as needed

    this.soundEffect = this.sound.add('capeManSound');

    // Add text object for the dialogue
    this.dialogueText = this.add.text(100, 120, '', {
      font: '24px Courier',
      color: '#ffffff',
    });
    this.capeManDialogueText = this.add.text(10, 700, '', {
      font: '24px Courier',
      color: '#780606',
    });

    // Start the dialogue
    this.typeText(
      'Hmm... kde to jsem?\nThis place feels strange...\nI should find a way out quickly.',
      this.dialogueText,
    );

    this.target = new Phaser.Math.Vector2(this.hero.x, this.hero.y);

    // Detekce kliknutí na obdélník
    rect3.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      handleRectClick(pointer, this.target, this.physics, this.hero);
    });
    // Detekce kliknutí na obdélník
    rect4.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      handleRectClick(pointer, this.target, this.physics, this.hero);
    });
    rect3.on('pointerover', () => handleRectOver(this.input));
    rect3.on('pointerout', () => handleRectOut(this.input));
    rect4.on('pointerover', () => handleRectOver(this.input));
    rect4.on('pointerout', () => handleRectOut(this.input));

    EventBus.emit('current-scene-ready', this);
  }

  // Function to type out text with a typing effect
  typeText(line: string, dialogue: Phaser.GameObjects.Text) {
    let charIndex = 0;

    this.time.addEvent({
      delay: 50, // Speed of typing (in milliseconds per character)
      callback: () => {
        if (charIndex < line.length) {
          dialogue.text += line[charIndex];
          charIndex++;
        } else {
          this.time.addEvent({
            delay: 1500, // Speed of typing (in milliseconds per character)
            callback: () => {
              // this.soundEffect.play();
              //this.capeManDialogueText.text =
              // 'Vítejte u nás!!! Připravil jsem si nějaké hry,\ntak si pojďme hrát... Mimochodem, mám Váší ženu.';
              //   this.add.image(512, 384, 'capeMan');
              dialogue.text = '';
            },
            repeat: 1,
          });
        }
      },
      repeat: line.length,
    });
  }

  update() {
    // Zastavení pohybu, pokud je hráč blízko cíle
    const distance = Phaser.Math.Distance.Between(
      this.hero.x,
      this.hero.y,
      this.target.x,
      this.target.y,
    );

    if (distance < 5) {
      this.hero.body?.stop(); // Zastavení
    }
  }

  changeScene() {
    this.scene.start('Game');
  }
}
