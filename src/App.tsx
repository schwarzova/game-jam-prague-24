import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';

function App() {
  // The sprite can only be moved in the MainMenu Scene
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const changeScene = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;

      if (scene) {
        scene.changeScene();
      }
    }
  };

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
      <div>
        <div>
          <button className="button" onClick={changeScene}>
            skip
          </button>
        </div>
        {/* <div>
          <button
            disabled={canMoveSprite}
            className="button"
            onClick={moveSprite}
          >
            Toggle Movement
          </button>
        </div>
        <div className="spritePosition">
          Sprite Position:
          <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
        </div>
        <div>
          <button className="button" onClick={addSprite}>
            Add New Sprite
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default App;
