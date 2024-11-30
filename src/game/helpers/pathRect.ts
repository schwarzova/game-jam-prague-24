export function createRect(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
): Phaser.GameObjects.Rectangle {
  // TODO comment out color
  const rect = scene.add.rectangle(x, y, width, height, 0x00ff00).setOrigin(0);
  rect.setInteractive();
  return rect;
}

export function handleRectClick(
  pointer: Phaser.Input.Pointer,
  target: Phaser.Math.Vector2,
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  hero: Phaser.Physics.Arcade.Sprite,
) {
  target.set(pointer.x, pointer.y);
  physics.moveTo(hero, target.x, target.y, 200);
}

export function handleRectOver(input: Phaser.Input.InputPlugin) {
  input.setDefaultCursor('url(assets/dummy/stepsCursor.cur), pointer');
}

export function handleRectOut(input: Phaser.Input.InputPlugin) {
  input.setDefaultCursor('default');
}
