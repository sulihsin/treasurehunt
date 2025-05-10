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
        // 播放背景音樂並設定為循環
        const bgm = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        bgm.play();

        // 添加 cover 圖片，並按照原比例縮放到螢幕大小（短邊留白）
        const coverImage = this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'cover').setOrigin(0.5, 0.5);
        const scale = Math.min(this.scale.width / coverImage.width, this.scale.height / coverImage.height); // 計算縮放比例
        coverImage.setScale(scale); // 按比例縮放

        // 等待 3 秒後讓玩家點擊任意地方跳轉到 dialog0
        this.time.delayedCall(3000, () => {
            this.input.once('pointerdown', () => {
                coverImage.setVisible(false); // 隱藏 cover 圖片

                // 顯示 dialog0 圖片，保持原始比例縮放到適配螢幕（短邊留白）
                const dialog0Image = this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'dialog0').setOrigin(0.5, 0.5);
                const dialogScale = Math.min(this.scale.width / dialog0Image.width, this.scale.height / dialog0Image.height);
                dialog0Image.setScale(dialogScale); // 按比例縮放

                // 顯示 start 按鈕，並設定位置和大小（按比例縮放）
                const startButton = this.add.image(this.scale.width * 0.5, this.scale.height * 0.9, 'startbutton')
                    .setOrigin(0.5, 0.5)
                    .setInteractive();
                const buttonWidth = this.scale.width * 0.12; // 按鈕寬度為螢幕寬度的 25%
                const buttonHeight = buttonWidth * 0.33; // 按鈕高度按圖片比例縮放 (假設圖片寬高比約為 2.5:1)
                startButton.setDisplaySize(buttonWidth, buttonHeight);

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