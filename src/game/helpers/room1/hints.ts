export function setHintsInteractive(hints: Phaser.GameObjects.Rectangle[]) {
  for (let index = 0; index < hints.length; index++) {
    const hint = hints[index];
    hint.setInteractive();
  }
}

export function setHintsDisableInteractive(
  hints: Phaser.GameObjects.Rectangle[],
) {
  for (let index = 0; index < hints.length; index++) {
    const hint = hints[index];
    hint.disableInteractive();
  }
}

export function createHint(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
): Phaser.GameObjects.Rectangle {
  {
    // TODO comment out color and opacity 0x00ff00, 0.7
    const rect = scene.add.rectangle(x, y, width, height).setOrigin(0);
    rect.setInteractive();
    return rect;
  }
}

export function createHints(
  scene: Phaser.Scene,
  onHintClick: (index: number) => void,
) {
  const lock = {
    rect: createHint(scene, 2770, 190, 40, 50),
  };
  const canal = {
    rect: createHint(scene, 2210, 380, 60, 60),
  };
  const wardrobe = {
    rect: createHint(scene, 2340, 40, 200, 200),
  };
  const flowers = {
    rect: createHint(scene, 2360, 680, 50, 150),
  };
  const bird = {
    rect: createHint(scene, 1700, 400, 100, 100),
  };
  const birdBox = {
    rect: createHint(scene, 1650, 600, 60, 60),
  };
  const tableBox = {
    rect: createHint(scene, 1340, 200, 100, 100),
  };
  const chemises = {
    rect: createHint(scene, 1150, 40, 180, 200),
  };
  const roller = {
    rect: createHint(scene, 1060, 550, 100, 200),
  };
  const hand = {
    rect: createHint(scene, 920, 440, 60, 60),
  };
  const shelf = {
    rect: createHint(scene, 730, 40, 100, 100),
  };
  const rope = {
    rect: createHint(scene, 200, 650, 80, 80),
  };

  const hints = [
    lock,
    canal,
    wardrobe,
    flowers,
    bird,
    birdBox,
    tableBox,
    chemises,
    roller,
    hand,
    shelf,
    rope,
  ];

  const hintsRect = hints.map((h) => h.rect);

  for (let index = 0; index < hints.length; index++) {
    const hint = hints[index];

    hint.rect.on('pointerdown', () => {
      // Open hint
      scene.input.setDefaultCursor('default');
      setHintsDisableInteractive(hintsRect);
      onHintClick(index);
    });

    hint.rect.on('pointerover', () => {
      scene.input.setDefaultCursor(
        'url(assets/room1/cursor_ruka.png) 32 32, auto',
      );
    });
    hint.rect.on('pointerout', () => {
      scene.input.setDefaultCursor('default');
    });
  }

  return hintsRect;
}

export function hideAllHintImages(hints: Phaser.GameObjects.Image[]) {
  for (let index = 0; index < hints.length; index++) {
    const hint = hints[index];
    hint.setVisible(false);
  }
}

export function createHintImage(scene: Phaser.Scene, imageKey: string) {
  const centerX = scene.scale.width / 2;
  const centerY = scene.scale.height / 2;

  return scene.add
    .image(centerX, centerY, imageKey)
    .setScrollFactor(0)
    .setVisible(false);
}

export function createHintImages(scene: Phaser.Scene) {
  const doorLock = createHintImage(scene, 'doorlock');
  const canal = createHintImage(scene, 'canal');
  const rope = createHintImage(scene, 'rope');

  return [
    doorLock,
    canal,
    rope,
    rope,
    rope,
    rope,
    rope,
    rope,
    rope,
    rope,
    rope,
    rope,
  ];
}
