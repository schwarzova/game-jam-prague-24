export function createRect(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
): Phaser.GameObjects.Rectangle {
  // TODO comment out color and opacity
  const rect = scene.add
    .rectangle(x, y, width, height, 0x00ff00, 0.7)
    .setOrigin(0);
  rect.setInteractive();
  return rect;
}

export function handleRectClick(
  pointer: Phaser.Input.Pointer,
  target: Phaser.Math.Vector2,
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  hero: Phaser.Physics.Arcade.Sprite,
  cameras: Phaser.Cameras.Scene2D.CameraManager,
) {
  const x = pointer.x + cameras.main.scrollX;
  const y = pointer.y + cameras.main.scrollY;

  target.set(x, y);
  physics.moveTo(hero, target.x, target.y, 200);
}

export function handleRectOver(input: Phaser.Input.InputPlugin) {
  input.setDefaultCursor('url(assets/dummy/stepsCursor.cur), pointer');
}

export function handleRectOut(input: Phaser.Input.InputPlugin) {
  input.setDefaultCursor('default');
}

export function setupMethodsAll(
  rects: Phaser.GameObjects.Rectangle[],
  target: Phaser.Math.Vector2,
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  hero: Phaser.Physics.Arcade.Sprite,
  cameras: Phaser.Cameras.Scene2D.CameraManager,
  input: Phaser.Input.InputPlugin,
) {
  for (let index = 0; index < rects.length; index++) {
    const rect = rects[index];
    rect.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      handleRectClick(pointer, target, physics, hero, cameras);
    });
    rect.on('pointerover', () => handleRectOver(input));
    rect.on('pointerout', () => handleRectOut(input));
  }
}
