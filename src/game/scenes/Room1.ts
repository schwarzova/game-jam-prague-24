import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import {
  createRect,
  setAllDisableInteractive,
  setAllInteractive,
  setupMethodsAll,
} from '../helpers/room1/pathRect';
import {
  createNumberHelpers,
  hideNumbers,
  showNumbers,
} from '../helpers/room1/doorLock';
import {
  createHintImages,
  createHints,
  hideAllHintImages,
  setHintsDisableInteractive,
  setHintsInteractive,
} from '../helpers/room1/hints';

export class Room1 extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Type for the cursor keys
  hero: Phaser.Physics.Arcade.Sprite;
  target: Phaser.Math.Vector2;
  eyes: Phaser.GameObjects.Image;
  // Dialog system
  dialogueText: Phaser.GameObjects.Text; // Text object for dialogue
  capeManDialogueText: Phaser.GameObjects.Text; // Text object for dialogue
  // sounds
  soundEffect: Phaser.Sound.BaseSound;
  // checks
  isSpeaking: boolean;
  isDark: boolean;

  constructor() {
    super('Room1');
  }

  preload() {
    // Background
    this.load.image(
      'backgroundRoom1',
      'assets/background/background_basement_flip.png',
    );
    this.load.image('sloup', 'assets/background/background-basement-sloup.png');
    this.load.image('flower', 'assets/room1/kytka.png');
    this.load.image('table', 'assets/room1/table.png');
    // Characters
    this.load.spritesheet('hero', 'assets/hero/hero_sprite_sheet.png', {
      frameWidth: 300,
      frameHeight: 400,
    });
    this.load.image('capeMan', 'assets/snb-filter.png');
    this.load.audio('capeManSound', 'assets/dummy/Room1CapeMan.mp3');
    this.load.image('eyes', 'assets/room1/oci.png');
    // Cursors
    this.load.image('cursorRuka', 'assets/room1/cursor_ruka.png');
    this.load.image('cursorBota', 'assets/room1/cursor_bota.png');
    // Hints
    this.load.image('cross', 'assets/room1/exit.png');
    this.load.image('doorlock', 'assets/room1/door_lock.png');
    this.load.image('canal', 'assets/room1/par_bot.png');
    this.load.image('rope', 'assets/room1/rope.png');
    this.load.image('skrin', 'assets/room1/skrin.png');
    this.load.image('flowers', 'assets/room1/kytka_detail.png');
    this.load.image('bird', 'assets/room1/papagai.png');
    this.load.image('birdBox', 'assets/room1/basa.png');
    this.load.image('tableBox', 'assets/room1/box.png');
    this.load.image('chemises', 'assets/room1/plaste.png');
    this.load.image('roller', 'assets/room1/wheels_box.png');
    this.load.image('hand', 'assets/room1/hand.png');
    this.load.image('shelf', 'assets/room1/shelf.png');
    // Music
    this.load.audio('codeWrong', 'assets/music/wrongCode.mp3');
  }

  create() {
    // Add and play the background music
    const music = this.sound.add('bgMusic', { loop: true, volume: 0.2 });

    this.isDark = true;
    this.isSpeaking = true;
    this.add
      .image(3000, 768, 'backgroundRoom1')
      .setScrollFactor(1)
      .setOrigin(1, 1);
    // Nakreslení cesty
    const rect1 = createRect(this, 500, 300, 400, 600);
    const rect2 = createRect(this, 160, 380, 340, 400);
    const rect3 = createRect(this, 900, 300, 340, 200);
    const rect4 = createRect(this, 1240, 500, 200, 220);
    const rect5 = createRect(this, 1240, 720, 600, 45);
    const rect55 = createRect(this, 1840, 660, 400, 150);
    const rect6 = createRect(this, 2090, 300, 400, 450);
    const rect7 = createRect(this, 2490, 400, 370, 300);
    const rects = [rect1, rect2, rect3, rect4, rect5, rect55, rect6, rect7];

    // Create the player character
    this.hero = this.physics.add.sprite(150, 580, 'hero').setOrigin(0.5, 0.9);
    this.hero.setScale(0.8);

    this.add.image(900, 380, 'sloup');
    this.add.image(2620, 740, 'table');
    this.add.image(2400, 680, 'flower');
    const blackBox = this.add.rectangle(0, 0, 3000, 768, 0x000000).setOrigin(0);
    const switchLightHelp = this.add
      .rectangle(50, 430, 10, 10, 0xffffff, 0.1)
      .setVisible(false);
    this.eyes = this.add.image(140, 390, 'eyes').setScale(0.8);
    const switchLight = this.add.rectangle(30, 410, 40, 40).setOrigin(0);
    switchLight.setInteractive();
    const capeMan = this.add.image(512, 384, 'capeMan').setVisible(false);

    const hintImages = createHintImages(this);
    const code = this.add
      .text(350, 220, '* * *', {
        font: '38px Courier',
        color: '#00000',
      })
      .setScrollFactor(0)
      .setVisible(false);

    const numbers = createNumberHelpers(this, code);

    const crossBtn = this.add
      .image(790, 110, 'cross')
      .setVisible(false)
      .setScrollFactor(0)
      .setInteractive();

    const handleHintClick = (index: number) => {
      if (index === 0) {
        code.setVisible(true);
        showNumbers(numbers);
      }

      hintImages[index].setVisible(true);
      crossBtn.setVisible(true);
      setAllDisableInteractive(rects);
    };
    const hints = createHints(this, handleHintClick);

    this.hero.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('hero', { start: 1, end: 8 }),
      frameRate: 8,
      repeat: -1,
    });

    this.hero.anims.create({
      key: 'idle',
      frames: [{ key: 'hero', frame: 0 }],
      frameRate: 20,
    });

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
    this.capeManDialogueText = this.add.text(200, 700, '', {
      font: '24px Courier',
      color: '#780606',
    });

    // Start the dialogue
    this.typeText(
      'Auu... kde to jsem?\nTo je divný místo...\nMěl bych se odsuď dostat.',
      this.dialogueText,
      capeMan,
      music,
      switchLightHelp,
    );
    this.isSpeaking = true;

    this.target = new Phaser.Math.Vector2(this.hero.x, this.hero.y);

    setupMethodsAll(
      rects,
      this.target,
      this.physics,
      this.hero,
      this.cameras,
      this.input,
    );

    switchLight.on('pointerdown', () => {
      if (this.isSpeaking) {
        return;
      }
      // hide black box
      if (this.isDark) {
        this.isDark = false;
        blackBox.setVisible(false);
        switchLightHelp.setVisible(false);
        this.eyes.setVisible(false);
        setAllInteractive(rects);
        setHintsInteractive(hints);
      } else {
        this.isDark = true;
        blackBox.setVisible(true);
        switchLightHelp.setVisible(true);
        this.eyes.setVisible(true);
        setAllDisableInteractive(rects);
        setHintsDisableInteractive(hints);
      }
    });
    switchLight.on('pointerover', () => {
      if (this.isSpeaking) {
        this.input.setDefaultCursor('default');
        return;
      }

      this.input.setDefaultCursor(
        'url(assets/room1/cursor_ruka.png) 32 32, auto',
      );
    });
    switchLight.on('pointerout', () => {
      this.input.setDefaultCursor('default');
    });

    crossBtn.on('pointerdown', () => {
      hideAllHintImages(hintImages);
      crossBtn.setVisible(false);
      hideNumbers(numbers);
      code.setVisible(false);
      setHintsInteractive(hints);
      setAllInteractive(rects);
    });

    EventBus.emit('current-scene-ready', this);
  }

  // Function to type out text with a typing effect
  typeText(
    line: string,
    dialogue: Phaser.GameObjects.Text,
    capeMan: Phaser.GameObjects.Image,
    music:
      | Phaser.Sound.NoAudioSound
      | Phaser.Sound.HTML5AudioSound
      | Phaser.Sound.WebAudioSound,
    switchLightHelp: Phaser.GameObjects.Rectangle,
  ) {
    let charIndex = 0;

    this.time.addEvent({
      delay: 50, // Speed of typing (in milliseconds per character)
      callback: () => {
        if (charIndex < line.length) {
          dialogue.text += line[charIndex];
          charIndex++;
        } else {
          this.time.delayedCall(2000, () => {
            this.soundEffect.play();
            this.capeManDialogueText.text =
              'Vítejte u nás!!! Připravil jsem si nějaké hry,\ntak si pojďme hrát... Mimochodem, mám Vaší ženu.';
            capeMan.setVisible(true);
            dialogue.text = '';
          });
          this.time.delayedCall(11000, () => {
            capeMan.setVisible(false);
            this.capeManDialogueText.text = '';
            dialogue.text =
              'Tu jsi klidně nech! Sakra je tu tma jak za komunismu.';
          });
          this.time.delayedCall(15000, () => {
            capeMan.setVisible(false);
            dialogue.text = '';
            this.isSpeaking = false;
            switchLightHelp.setVisible(true);
            music.play();
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
      this.hero.anims.play('idle', true);
      this.eyes.setX(this.hero.x - 5);
      this.eyes.setY(this.hero.y - 200);
    } else if (this.hero.x < this.target.x) {
      this.hero.anims.play('left', true);
      this.hero.setFlipX(true);
    } else {
      this.hero.anims.play('left', true);
      this.hero.setFlipX(false);
    }
  }

  changeScene() {
    this.scene.start('LoadingScene3');
  }
}
