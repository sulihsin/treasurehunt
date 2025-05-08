class Scene8 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene8' });
    }

    preload() {
        this.load.image('dialog10', 'assets/images/dialog10.png');
        this.load.image('dialog11', 'assets/images/dialog11.png');
        this.load.image('dialog12', 'assets/images/dialog12.png');
        this.load.image('skip', 'assets/images/skip.png');
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        this.gameBGM.play();

        // 初始化 dialog 圖片陣列
        this.dialogImages = [
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog10').setOrigin(0.5, 0.5),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog11').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog12').setOrigin(0.5, 0.5).setAlpha(0)
        ];

        // 縮放每個 dialog 圖片以適應螢幕大小，並保持比例
        this.dialogImages.forEach(dialog => {
            this.scaleToFitScreen(dialog);
        });

        // 顯示 skip 按鈕，並確保在最上層
        this.skipImage = this.add.image(1030, 550, 'skip').setDisplaySize(100, 50).setOrigin(0, 0).setInteractive();
        this.skipImage.setDepth(1); // 確保 skip 按鈕在最上層
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
            // 所有 dialog 圖片都顯示過，切換到 Scene9
            this.gameBGM.stop(); // 停止背景音樂
            this.scene.start('Scene9');
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

export default Scene8;