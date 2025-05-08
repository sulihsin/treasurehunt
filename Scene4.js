class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
    }

    preload() {
        // 加載需要的資源
        this.load.image('cover', 'assets/images/cover.PNG');
        this.load.image('dialog0', 'assets/images/dialog0.png');
        this.load.image('startbutton', 'assets/images/startbutton.png');
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 撥放背景音樂並設定為循環
        const bgm = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        bgm.play();

        // 添加 cover 圖片，並使其依原始比例顯示在畫面中央
        const coverImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'cover').setOrigin(0.5, 0.5);

        // 計算縮放比例，依原始比例縮放
        const scaleX = this.cameras.main.width / coverImage.width;
        const scaleY = this.cameras.main.height / coverImage.height;
        const scale = Math.min(scaleX, scaleY); // 確保圖片保持原始比例
        coverImage.setScale(scale);

        // 等待 3 秒後讓玩家點擊任意地方跳轉到 dialog0
        this.time.delayedCall(3000, () => {
            this.input.once('pointerdown', () => {
                coverImage.setVisible(false); // 隱藏 cover 圖片

                // 顯示 dialog0 圖片，大小依原檔比例縮放到剛好
                let dialog0Image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog0')
                    .setOrigin(0.5, 0.5);
                let scaleX = this.cameras.main.width / dialog0Image.width;
                let scaleY = this.cameras.main.height / dialog0Image.height;
                let scale = Math.min(scaleX, scaleY); // 確保圖片保持比例
                dialog0Image.setScale(scale);

                // 顯示 start 按鈕
                let startButton = this.add.image(this.cameras.main.width / 2, 570, 'startbutton')
                    .setDisplaySize(200, 80) // 設定按鈕大小
                    .setOrigin(0.5, 0.5)
                    .setInteractive();

                // 添加 start 按鈕點擊事件
                startButton.on('pointerdown', () => {
                    bgm.stop(); // 切換場景時停止背景音樂
                    this.scene.start('Scene5'); // 切換到 Scene5
                });
            });
        });
    }
}

export default Scene4;