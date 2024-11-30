import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Scene3 extends Scene {
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private background!: Phaser.GameObjects.TileSprite;
  private gameText!: Phaser.GameObjects.Text;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private broken!: Phaser.Physics.Arcade.StaticGroup;
  private trampoline!: Phaser.Physics.Arcade.StaticGroup;
  private player2!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private gameOver! = false;

  constructor() {
    //super('Scene3');
    super({
      key: 'Scene3',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 300 },
        },
      },
    });
  }
  preload() {
    this.load.image('ground', 'assets/box.png');
    this.load.image('box', 'assets/box2.png');
    this.load.image('broken_box', 'assets/broken_box.png');
    this.load.image('trampoline', 'assets/trampoline.png');
    this.load.image('key', 'assets/key.png');
    this.load.image('back', 'assets/back.png');
    this.load.spritesheet('dude1', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet('dude', 'assets/hero/hero_sprite_sheet.png', {
      frameWidth: 300,
      frameHeight: 400,
    });
  }

  create() {
    // Nastavení světa (1024x3000)
    this.cameras.main.setBounds(0, 0, 1024, 3000);
    this.physics.world.setBounds(0, 0, 1024, 3000);
    // Přidání pozadí (výška světa 3000 px, pozadí musí být opakovatelné)
    this.background = this.add.tileSprite(512, 1500, 1024, 3000, 'back');
    //this.add.image(0, 2800, 'background');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();
    this.broken = this.physics.add.staticGroup();
    this.trampoline = this.physics.add.staticGroup();
    // Generuji zem
    for (let i = 0; i < 32; i++) {
      const x = i * 32; // X souřadnice s odstupem 200 pixelů
      const y = 2970; // Y souřadnice (stejná výška)
      this.platforms.create(x, y, 'ground').setScale(2).refreshBody();
    }
    //this.platforms.create(0, 704, 'ground').setScale(2).refreshBody().setOrigin(0);

    //  Now let's create some ledges
    this.platform(520, 400, 5, 'box');
    this.platform(50, 200, 5, 'box');
    this.platform(750, 220, 5, 'box');
    this.platform(300, 300, 7, 'box');
    this.platform(50, 400, 3, 'box');
    this.platform(120, 500, 6, 'box');
    this.platform(520, 600, 6, 'box');
    this.platform(120, 700, 6, 'box');
    this.platform(520, 800, 6, 'box');
    this.platform(120, 900, 6, 'box');
    this.platform(520, 1000, 6, 'box');
    this.platform(120, 1100, 6, 'box');
    this.platform(520, 1200, 6, 'box');
    this.platform(120, 1300, 6, 'box');
    this.platform(520, 1400, 6, 'box');
    this.platform(120, 1500, 6, 'box');
    this.platform(520, 1600, 6, 'box');
    this.platform(120, 1700, 6, 'box');
    this.platform(520, 1800, 6, 'box');
    this.platform(120, 1900, 6, 'box');
    this.platform(520, 2000, 6, 'box');
    this.platform(120, 2100, 6, 'box');
    this.platform(520, 2200, 6, 'box');
    this.platform(120, 2300, 6, 'box');
    this.platform(520, 2400, 6, 'box');
    this.platform(120, 2500, 6, 'box');
    this.platform(520, 2600, 6, 'box');
    this.platform(150, 2650, 6, 'broken_box');
    this.platform(220, 2700, 6, 'box');
    this.platform(80, 2700, 2, 'box');
    this.platform(90, 2673, 1, 'trampoline');
    this.platform(750, 2750, 6, 'broken_box');
    this.platform(520, 2800, 6, 'box');

    this.player2 = this.physics.add.sprite(100, 2800, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    this.player2.setBounce(0.2);
    this.player2.setScale(0.2);
    this.player2.setCollideWorldBounds(true);
    this.player2.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 8 }),
      frameRate: 8,
      repeat: -1,
    });

    this.player2.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 0 }],
      frameRate: 20,
    });

    this.player2.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 8 }),
      frameRate: 8,
      repeat: -1,
    });

    // Kamera sleduje hráče
    this.cameras.main.startFollow(this.player2);

    //  Input Events
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.physics.add.collider(this.player2, this.platforms);
      // Kolize hráče s broken
      this.physics.add.collider(this.player2, this.broken, this.onPlatformCollision, undefined, this);
      // Kolize hráče s trampolínami
      this.physics.add.collider(this.player2, this.trampoline, this.onTrampolineHit, undefined, this);

      
  

    EventBus.emit('current-scene-ready', this);
  }

onPlatformCollision(player: Phaser.Physics.Arcade.Sprite, platform: Phaser.Physics.Arcade.Sprite): void {
    // Spustí časovač, který platformu odstraní po 1 sekundě
    this.time.delayedCall(100, () => {
        platform.destroy(); // Zničí platformu
    });
}

    onTrampolineHit(player: Phaser.Physics.Arcade.Sprite, trampoline: Phaser.Physics.Arcade.Sprite): void {
        // Nastavení větší vertikální rychlosti (odraz)
        player.setVelocityY(-500); // Čím vyšší záporná hodnota, tím větší odraz

        // Volitelně: vizuální efekt při odrazu
        trampoline.setTint(0xff0000); // Změní barvu trampolíny na červenou
        this.time.delayedCall(200, () => trampoline.clearTint()); // Po 200 ms vrátí původní barvu
    }

  update() {
    if (this.cursors.left.isDown) {
      this.player2.setFlipX(false);
      this.player2.setVelocityX(-160);

      this.player2.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player2.setFlipX(true);
      this.player2.setVelocityX(160);

      this.player2.anims.play('right', true);
    } else {
      this.player2.setVelocityX(0);

      this.player2.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player2.body.touching.down) {
      this.player2.setVelocityY(-330);
    }
  }

  platform(xs: number, ys: number, how: number, type: string) {
    for (let i = 0; i < how; i++) {
        const x = xs + i * 32; // X souřadnice s odstupem 200 pixelů
        if (type == 'broken_box') {
            this.broken.create(x, ys, type);
        } else if (type == 'trampoline') {
            this.trampoline.create(x, ys, type);        
        }else {
            this.platforms.create(x, ys, type);
        }
      
    }
  }

  changeScene() {
    this.scene.start('GameOver');
  }
}
