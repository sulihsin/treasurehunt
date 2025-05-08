class Scene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3' });
    }

    preload() {
        // 加載需要的資源
        this.load.image('paper', 'assets/images/paper.png');
        this.load.image('word', 'assets/images/word.png');
        this.load.image('startButton', 'assets/images/startButton.png');
    }

    create() {
        // 添加底圖
        this.add.image(500, 300, 'paper').setOrigin(0.5);

        // 添加文字圖片
        const word = this.add.image(500, 300, 'word').setOrigin(0.5);
        word.setAlpha(0);

        // 添加文字圖片浮現效果
        this.tweens.add({
            targets: word,
            alpha: 1,
            duration: 3000,
            ease: 'Linear'
        });

        // 添加開始按鈕
        const startButton = this.add.image(500, 550, 'startButton').setInteractive().setOrigin(0.5);
        startButton.on('pointerdown', () => {
            this.scene.start('Scene1'); // 切換到 Scene1
        });
    }
}

export default Scene3;