export function showNumbers(numbers: Phaser.GameObjects.Rectangle[]) {
  for (let i = 0; i < numbers.length; i++) {
    numbers[i].setVisible(true);
  }
}

export function hideNumbers(numbers: Phaser.GameObjects.Rectangle[]) {
  for (let i = 0; i < numbers.length; i++) {
    numbers[i].setVisible(false);
  }
}

export function createNumberHelpers(
  scene: Phaser.Scene,
  code: Phaser.GameObjects.Text,
) {
  // Define numbers
  const number1 = scene.add.rectangle(340, 370, 70, 70);
  number1.setInteractive();
  const number2 = scene.add.rectangle(450, 370, 70, 70);
  number2.setInteractive();
  const number3 = scene.add.rectangle(570, 370, 70, 70);
  number3.setInteractive();
  const number4 = scene.add.rectangle(340, 470, 70, 70);
  number4.setInteractive();
  const number5 = scene.add.rectangle(450, 470, 70, 70);
  number5.setInteractive();
  const number6 = scene.add.rectangle(570, 470, 70, 70);
  number6.setInteractive();
  const number7 = scene.add.rectangle(340, 570, 70, 70);
  number7.setInteractive();
  const number8 = scene.add.rectangle(450, 570, 70, 70);
  number8.setInteractive();
  const number9 = scene.add.rectangle(570, 570, 70, 70);
  number9.setInteractive();

  const numbers = [
    number1,
    number2,
    number3,
    number4,
    number5,
    number6,
    number7,
    number8,
    number9,
  ];

  for (let i = 0; i < numbers.length; i++) {
    numbers[i].setScrollFactor(0);

    numbers[i].on('pointerdown', () => {
      if (code.text[0] === '*') {
        code.text = `${i + 1} * *`;
        return;
      }
      if (code.text[2] === '*') {
        code.text = `${code.text[0]} ${i + 1} *`;
        return;
      }
      if (code.text[4] === '*') {
        code.text = `${code.text[0]} ${code.text[2]} ${i + 1}`;
        // TODO NEW SCENE

        if (code.text === '2 7 9') {
          scene.scene.start('LoadingScene3');
          return;
        }

        scene.sound.add('codeWrong').play();
        return;
      }

      code.text = `${i + 1} * *`;
    });
  }

  hideNumbers(numbers);

  return numbers;
}
