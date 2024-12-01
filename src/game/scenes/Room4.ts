import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Room4 extends Scene {
  crane: Phaser.GameObjects.Image;
  magnet: Phaser.GameObjects.Image;
  private rope!: Phaser.GameObjects.Graphics; // Grafika pro provaz
  private keysGroup!: Phaser.Physics.Arcade.Group;
  private isMagnetDropping: boolean = false;

  constructor() {
    super('Room4');
  }

  preload() {
    this.load.image('crane', 'path/to/crane.png'); // Obrázek jeřábu
    this.load.image('magnet', 'assets/room2/bullet.png'); // Obrázek magnetu
    this.load.image('key_room4', 'assets/room2/key.png');
    this.load.image('belt', 'path/to/belt.png'); // Obrázek pásu
    this.load.image('bigMapRoom3', 'assets/bigMap3.png');
  }

  create() {
    // Grafika pro provaz
    this.rope = this.add.graphics();
    this.showInitText();

    const map = this.add
      .rectangle(900, 140, 40, 40, 0x00ff00, 0.7)
      .setOrigin(0);
    map.setInteractive();

    // Přidání jeřábu na scénu
    this.crane = this.add.image(400, 50, 'crane');

    // Přidání magnetu pod jeřáb
    this.magnet = this.physics.add.image(400, 100, 'magnet');
    this.magnet.body.allowGravity = false;

    // Vytvoření pohyblivého pásu
    const conveyorBelt = this.physics.add.staticGroup();
    for (let i = 0; i < 10; i++) {
      conveyorBelt.create(i * 80, 650, 'belt');
    }

    // Vytvoření klíčů na pásu
    this.keysGroup = this.physics.add.group({
      key: 'key_room4',
      repeat: 2,
      setXY: { x: 50, y: 600, stepX: 250 },
    });

    this.keysGroup.children.iterate((key) => {
      const keySprite = key as Phaser.Physics.Arcade.Sprite;
      keySprite.setVelocityX(150); // Klíče se pohybují po pásu
      keySprite.setCollideWorldBounds(true);
      keySprite.setBounce(1);
    });

    // Kolize magnetu s klíči
    this.physics.add.overlap(
      this.magnet,
      this.keysGroup,
      this.collectKey,
      undefined,
      this,
    );

    // Poslech klávesy mezerník
    this.input?.keyboard?.on('keydown-SPACE', this.dropMagnet, this);

    map.on('pointerdown', () => {
      const big = this.add.image(512, 384, 'bigMapRoom3').setScrollFactor(0);
      this.time.delayedCall(4000, () => {
        big.destroy(); // Odstranění textu
      });
    });

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    // Aktualizace provazu
    this.drawRope();

    if (this.isMagnetDropping) {
      // Kontrola, zda magnet dorazil na spodní okraj
      if (this.magnet.y >= 600) {
        this.magnet.setVelocityY(0);
        this.isMagnetDropping = false;
      }
    }

    // Pokud magnet není spuštěn, udržuj jej pod jeřábem
    if (!this.isMagnetDropping) {
      this.magnet.x = this.crane.x;
      this.magnet.y = this.crane.y + 50;
    }
  }

  private drawRope() {
    // Vymazání staré grafiky
    this.rope.clear();

    // Nakreslení provazu mezi jeřábem a magnetem
    this.rope.lineStyle(2, 0x000000, 1); // Bílá čára o šířce 2 px
    this.rope.beginPath();
    this.rope.moveTo(this.crane.x, this.crane.y); // Začátek u jeřábu
    this.rope.lineTo(this.magnet.x, this.magnet.y); // Konec u magnetu
    this.rope.strokePath();
  }

  private dropMagnet() {
    if (!this.isMagnetDropping) {
      this.isMagnetDropping = true;
      this.magnet.setVelocityY(200); // Magnet se začne spouštět dolů
    }
  }

  collectKey(
    magnet: Phaser.Physics.Arcade.Sprite,
    key: Phaser.Physics.Arcade.Sprite,
  ) {
    key.disableBody(true, true); // Klíč zmizí, když jej magnet chytí

    // Kontrola, zda hráč chytil všechny klíče
    if (this.keysGroup.countActive(true) === 0) {
      this.add.text(300, 300, 'Vítězství!', {
        fontSize: '32px',
        color: '#fff',
      });
    }

    this.keysGroup.children.iterate((key) => {
      const keySprite = key as Phaser.Physics.Arcade.Sprite;
      const len = this.keysGroup.getLength();
      keySprite.setVelocityX(len === 2 ? 250 : 350); // Klíče se pohybují po pásu
    });

    // Resetuj magnet do výchozí pozice
    this.isMagnetDropping = false;
    magnet.setVelocityY(0);
    magnet.y = this.crane.y + 50;
  }

  showInitText(): void {
    // Zobrazení zprávy s fade-in efektem
    const message = this.add
      .text(800, 100, 'Dveře mají 3 zámky no super...', {
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

  changeScene() {
    this.scene.start('MainMenu');
  }
}
