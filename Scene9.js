class Scene9 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene9' });
    }

    preload() {
        this.load.image('dialog13', 'assets/images/dialog13.png');
        this.load.image('dialog14', 'assets/images/dialog14.png');
        this.load.image('dialog15', 'assets/images/dialog15.png');
        this.load.image('dialog16', 'assets/images/dialog16.png');
        this.load.image('skip', 'assets/images/skip.png');
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', {volume: 1.5, loop: true });
        this.gameBGM.play();

        // 初始化 dialog 圖片陣列
        this.dialogImages = [
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog13').setOrigin(0.5, 0.5),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog14').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog15').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog16').setOrigin(0.5, 0.5).setAlpha(0)
        ];

        // 縮放每個 dialog 圖片以適應螢幕大小，並保持比例
        this.dialogImages.forEach(dialog => {
            this.scaleToFitScreen(dialog);
        });

        // 計算相對位置和縮放
this.skipImage = this.add.image(this.scale.width * 0.93, this.scale.height * 0.93, 'skip')
.setOrigin(0.5, 0.5) // 設置圖片的原點為中心
.setInteractive();

// 計算按鈕的大小，根據螢幕寬高比例進行縮放
this.skipImage.setDisplaySize(this.scale.width * 0.1, this.scale.height * 0.08); // 按比例調整大小
        this.currentDialogIndex = 0;

        // 設定 skip 按鈕點擊事件
        this.skipImage.on('pointerdown', () => {
            this.showNextDialog();
        });
    }

    showNextDialog() {
        if (this.currentDialogIndex < this.dialogImages.length - 1) {
            // 隱藏當前的 dialog 圖片
            this.dialogImages[this.currentDialogIndex].setAlpha(0);
            this.currentDialogIndex++;
            // 顯示下一個 dialog 圖片
            this.dialogImages[this.currentDialogIndex].setAlpha(1);
        } else {
            // 所有 dialog 圖片都顯示過，切換到 Scene10
            this.gameBGM.stop(); // 停止背景音樂
            this.scene.start('Scene10');
        }
    }

    scaleToFitScreen(image) {
        // 計算縮放比例，維持圖片原始比例
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY); // 窄邊留白，選擇較小的縮放比例
        image.setScale(scale);
    }
}

export default Scene9;