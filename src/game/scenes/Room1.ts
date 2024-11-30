import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { createRect, setupMethodsAll } from '../helpers/pathRect';

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
      'assets/background/background_basement_flip.png',
    );
    this.load.image('sloup', 'assets/background/background-basement-sloup.png');
    this.load.image('hero', 'assets/hero/hero.png');
    this.load.image('capeMan', 'assets/dummy/capeMan.png');
    this.load.audio('capeManSound', 'assets/dummy/Room1CapeMan.mp3');
    this.load.image('stepsCursor', 'assets/dummy/stepsCursor.cur');
    // this.load.image('pointCursor', 'assets/dummy/custom-cursor.png');
  }

  create() {
    this.add
      .image(3000, 768, 'backgroundRoom1')
      .setScrollFactor(1)
      .setOrigin(1, 1);
    // Nakreslení cesty
    const rect1 = createRect(this, 500, 300, 400, 600);
    const rect2 = createRect(this, 160, 380, 340, 400);
    const rect3 = createRect(this, 900, 300, 340, 200);
    const rect4 = createRect(this, 1240, 500, 200, 220);
    const rect5 = createRect(this, 1240, 720, 1000, 45);
    const rect6 = createRect(this, 2090, 300, 400, 450);
    const rect7 = createRect(this, 2490, 400, 370, 300);

    // Create the player character
    this.hero = this.physics.add.sprite(200, 484, 'hero').setOrigin(0.5, 0.9);
    this.hero.setScale(0.7);
    this.add.image(900, 380, 'sloup');
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

    setupMethodsAll(
      [rect1, rect2, rect3, rect4, rect5, rect6, rect7],
      this.target,
      this.physics,
      this.hero,
      this.cameras,
      this.input,
    );

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
