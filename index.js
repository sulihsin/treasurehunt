import Scene1 from './Scene1.js';
import Scene2 from './Scene2.js';
import Scene3 from './Scene3.js';
import Scene4 from './Scene4.js';
import Scene5 from './Scene5.js';
import Scene6 from './Scene6.js';
import Scene7 from './Scene7.js';
import Scene8 from './Scene8.js';
import Scene9 from './Scene9.js';
import Scene10 from './Scene10.js';
import Scene11 from './Scene11.js';
import Scene12 from './Scene12.js';
import Scene13 from './Scene13.js';
import Scene14 from './Scene14.js';
import Scene15 from './Scene15.js';
import Scene16 from './Scene16.js';
import Scene17 from './Scene17.js'

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: 'game-container',
    scene: [Scene4, Scene5, Scene6, Scene1, Scene7, Scene2, Scene8, Scene9, Scene10, Scene11, Scene12, Scene13, Scene14, Scene15, Scene16, Scene17],
    pixelArt: false,
    antialias: true,
    backgroundColor: '#ffffff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

export default game;