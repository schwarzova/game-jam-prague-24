import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Scene3 extends Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private broken!: Phaser.Physics.Arcade.StaticGroup;
  private trampoline!: Phaser.Physics.Arcade.StaticGroup;
  private player2!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private bats!: Phaser.Physics.Arcade.Group; // Skupina netopýrů
  private key!: Phaser.Physics.Arcade.Sprite; // Klíč jako sprite
  private gun!: Phaser.Physics.Arcade.Sprite; // Zbran jako sprite
  private door!: Phaser.Physics.Arcade.Sprite; // Door jako sprite
  private coins!: Phaser.Physics.Arcade.Group;
  private shotsIndicator: Phaser.GameObjects.Image;
  private shotsNum: Phaser.GameObjects.Text;
  private inventory: string[] = [];
  private shots: number = 0;

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
    this.load.image('key', 'assets/room2/key.png');
    this.load.image('gun', 'assets/room2/gun.png');
    this.load.image('door_scene3', 'assets/room2/door.png');
    this.load.image('back', 'assets/back.png');
    this.load.image('coin', 'assets/room2/bullet.png');
    this.load.spritesheet('bat', 'assets/room2/bat_sprite_sheet.png', {
      frameWidth: 100,
      frameHeight: 100,
    });
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

    // Střely
    this.coins = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true,
    });

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

    this.shotsIndicator = this.add
      .image(1010, 750, 'coin')
      .setScrollFactor(0)
      .setScale(2)
      .setVisible(false);
    this.shotsNum = this.add
      .text(946, 740, '', {
        font: '24px Courier',
        color: '#ffffff',
      })
      .setScrollFactor(0)
      .setVisible(false);
    //this.platforms.create(0, 704, 'ground').setScale(2).refreshBody().setOrigin(0);

    //  platormy
    this.platform(50, 200, 5, 'box');
    this.platform(750, 420, 5, 'box');
    this.platform(300, 300, 7, 'broken_box');
    this.platform(50, 400, 3, 'box');
    this.platform(120, 500, 6, 'box');
    this.platform(520, 600, 4, 'box');
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
    this.platform(120, 1700, 10, 'broken_box');

    this.platform(920, 1700, 10, 'box');
    this.platform(720, 1850, 1, 'box');
    this.platform(650, 1950, 1, 'box');
    this.platform(580, 2050, 1, 'box');
    this.platform(450, 2150, 1, 'box');
    this.platform(120, 1900, 6, 'box');
    this.platform(620, 2250, 10, 'broken_box');

    this.platform(120, 2300, 6, 'box');
    this.platform(520, 2400, 6, 'box');
    this.platform(80, 2700, 6, 'box');
    this.platform(90, 2673, 1, 'trampoline');
    this.platform(450, 2550, 10, 'broken_box');
    this.platform(520, 2800, 16, 'box');

    this.player2 = this.physics.add.sprite(100, 2800, 'dude');
    this.showInitText();

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

    // Vytvoření animace netopýra
    this.anims.create({
      key: 'batFly',
      frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 3 }), // Snímky 0 až 3
      frameRate: 10, // Počet snímků za sekundu
      repeat: -1, // Animace se opakuje
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
    this.physics.add.collider(
      this.player2,
      this.broken,
      this.onPlatformCollision,
      undefined,
      this,
    );
    // Kolize hráče s trampolínami
    this.physics.add.collider(
      this.player2,
      this.trampoline,
      this.onTrampolineHit,
      undefined,
      this,
    );
    // Přidání klíče
    this.key = this.physics.add.sprite(300, 2000, 'key');
    this.key.setBounce(0.5); // Klíč se může lehce odrážet
    this.key.setCollideWorldBounds(true);

    // Kolize klíče s platformami (aby klíč nespadl)
    this.physics.add.collider(this.key, this.platforms);

    // Kolize hráče s platformami
    this.physics.add.collider(this.player2, this.platforms);

    // Detekce sbírání klíče hráčem
    this.physics.add.overlap(
      this.player2,
      this.key,
      this.collectKey,
      undefined,
      this,
    );

    // Přidání zbrane
    this.gun = this.physics.add.sprite(950, 1650, 'gun');
    this.gun.setBounce(0.5);
    this.gun.setCollideWorldBounds(true);

    // Kolize zbrane s platformami (aby zbran nespadla)
    this.physics.add.collider(this.gun, this.platforms);

    // Detekce sbírání zbrane hráčem
    this.physics.add.overlap(
      this.player2,
      this.gun,
      this.collectGun,
      undefined,
      this,
    );

    // Přidání Dveří
    this.door = this.physics.add.sprite(50, 200, 'door_scene3');
    this.door.setBounce(0.5); // Klíč se může lehce odrážet
    this.door.setCollideWorldBounds(true);

    // Kolize klíče s platformami (aby klíč nespadl)
    this.physics.add.collider(this.door, this.platforms);

    // Detekce dvere s hráčem
    this.physics.add.overlap(
      this.player2,
      this.door,
      this.goToDoor,
      undefined,
      this,
    );

    // Vytvoření skupiny netopýrů
    this.bats = this.physics.add.group({
      key: 'bat',
      repeat: 6, // Počet netopýrů
      setXY: { x: 100, y: 1000, stepX: 200 }, // Rozmístění
    });
    this.physics.add.collider(this.bats, this.platforms);
    // Přidání náhodného pohybu netopýrům
    this.bats.children.iterate((bat) => {
      const batSprite = bat as Phaser.Physics.Arcade.Sprite;
      batSprite.setCollideWorldBounds(true);
      batSprite.setBounce(1);
      this.addRandomMovement(batSprite);

      // Přehrání animace
      batSprite.play('batFly');
      // Vypnutí gravitace pro netopýra
      batSprite.body.allowGravity = false;
    });

    // Detekce dotyku hráče s netopýry
    this.physics.add.overlap(
      this.player2,
      this.bats,
      this.playerDies,
      undefined,
      this,
    );

    // Kolize střel s netopýry
    this.physics.add.overlap(
      this.coins,
      this.bats,
      this.hitBat,
      undefined,
      this,
    );

    // Klávesnice pro ovládání
    this.input.keyboard.on('keydown-SPACE', this.shootBullet, this);

    EventBus.emit('current-scene-ready', this);
  }

  shootBullet(): void {
    if (!this.inventory.includes('gun') || this.shots === 0) {
      return;
    }

    const bullet = this.coins.get() as Phaser.Physics.Arcade.Image;
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);

      // Nastavení pozice střely podle hráče
      bullet.setPosition(this.player2.x, this.player2.y);

      // Vypnutí gravitace pro střelu
      bullet.body.allowGravity = false;
      bullet.setTexture('coin');

      // Směr střely
      const direction = this.player2.flipX ? 1 : -1; // Pokud je hráč otočen doleva, střílí doleva
      bullet.setVelocityX(300 * direction); // Střela letí doprava nebo doleva
      this.shots = this.shots - 1;
      this.shotsNum.text = `# ${this.shots}`;
    }
  }

  hitBat(
    bullet: Phaser.Physics.Arcade.Image,
    bat: Phaser.Physics.Arcade.Sprite,
  ): void {
    // Kontrola, zda objekty stále existují
    if (bullet.active && bat.active) {
      bullet.destroy(); // Znič střelu
      // Deaktivuj netopýra
      bat.setActive(false);
      bat.setVisible(false);
      bat.body.enable = false; // Vypni fyziku
    }
  }

  addRandomMovement(bat: Phaser.Physics.Arcade.Sprite): void {
    this.time.addEvent({
      delay: 2000, // Každé 2 sekundy
      callback: () => {
        const randomX = Phaser.Math.Between(-200, 200);
        const randomY = Phaser.Math.Between(-200, 200);
        bat.setVelocity(randomX, randomY); // Nastaví náhodnou rychlost
        //bat.setDrag(20, 20); // Přidání odporu pro ještě pomalejší pohyb
      },
      loop: true,
    });
  }

  playerDies(
    player: Phaser.Physics.Arcade.Sprite,
    // bat: Phaser.Physics.Arcade.Sprite,
  ): void {
    //console.log('Hráč zemřel!');

    // Zastavení hráče
    player.setTint(0xff0000); // Změní barvu hráče na červenou
    player.setVelocity(0, 0);

    // Restart hry po 2 sekundách
    this.time.delayedCall(2000, () => {
      this.scene.restart();
    });
  }

  collectKey(
    player: Phaser.Physics.Arcade.Sprite,
    key: Phaser.Physics.Arcade.Sprite,
  ): void {
    // Přidání klíče do inventáře
    this.inventory.push('key');
    //console.log('Klíč sebrán! Inventář:', this.inventory);

    // Odstranění klíče ze scény
    key.destroy();

    // Zobrazení zprávy s fade-in efektem
    const message = this.add
      .text(player.x, player.y - 50, 'Klíč sebrán! A hurá pro ženu.', {
        font: '16px Arial',
        color: '#fff',
      })
      .setOrigin(0.5)
      .setAlpha(0); // Začíná neviditelný (alpha = 0)

    // Použití tween pro fade-in
    this.tweens.add({
      targets: message,
      alpha: 1, // Alpha se zvýší na 1 (viditelný)
      duration: 500, // Doba trvání efektu v ms
      onComplete: () => {
        // Po určité době text zmizí
        this.time.delayedCall(1000, () => {
          message.destroy(); // Odstranění textu
        });
      },
    });
  }

  collectGun(
    player: Phaser.Physics.Arcade.Sprite,
    gun: Phaser.Physics.Arcade.Sprite,
  ): void {
    // Přidání klíče do inventáře
    this.inventory.push('gun');
    this.shots = 7;
    this.shotsIndicator.setVisible(true);
    this.shotsNum.setVisible(true);
    this.shotsNum.text = `# ${this.shots}`;

    // Odstranění klíče ze scény
    gun.destroy();

    // Zobrazení zprávy s fade-in efektem
    const message = this.add
      .text(player.x, player.y - 50, 'Teď můžu střílet!\n(Mezerník)', {
        font: '16px Arial',
        color: '#fff',
      })
      .setOrigin(0.5)
      .setAlpha(0); // Začíná neviditelný (alpha = 0)

    // Použití tween pro fade-in
    this.tweens.add({
      targets: message,
      alpha: 1, // Alpha se zvýší na 1 (viditelný)
      duration: 500, // Doba trvání efektu v ms
      onComplete: () => {
        // Po určité době text zmizí
        this.time.delayedCall(1500, () => {
          message.destroy(); // Odstranění textu
        });
      },
    });
  }

  showInitText(): void {
    // Zobrazení zprávy s fade-in efektem
    const message = this.add
      .text(200, 2800, 'Sakra, musím vyskákat až nahoru.', {
        font: '16px Arial',
        color: '#fff',
      })
      .setOrigin(0.5)
      .setAlpha(0); // Začíná neviditelný (alpha = 0)

    // Použití tween pro fade-in
    this.tweens.add({
      targets: message,
      alpha: 1, // Alpha se zvýší na 1 (viditelný)
      duration: 500, // Doba trvání efektu v ms
      onComplete: () => {
        // Po určité době text zmizí
        this.time.delayedCall(1500, () => {
          message.destroy(); // Odstranění textu
        });
      },
    });
  }

  goToDoor(): void {
    if (!this.inventory.includes('key')) {
      return;
    }

    this.scene.start('Room4');
  }

  onPlatformCollision(
    _player: Phaser.Physics.Arcade.Sprite,
    platform: Phaser.Physics.Arcade.Sprite,
  ): void {
    // Spustí časovač, který platformu odstraní po 1 sekundě
    this.time.delayedCall(100, () => {
      platform.destroy(); // Zničí platformu
    });
  }

  onTrampolineHit(
    player: Phaser.Physics.Arcade.Sprite,
    trampoline: Phaser.Physics.Arcade.Sprite,
  ): void {
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
      } else {
        this.platforms.create(x, ys, type);
      }
    }
  }

  changeScene() {
    this.scene.start('Room4');
  }
}
