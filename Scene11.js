class Scene11 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene11' });
    }

    preload() {
        this.load.image('dialog17', 'assets/images/dialog17.png');
        this.load.image('dialog18', 'assets/images/dialog18.png');
        this.load.image('dialog19', 'assets/images/dialog19.png');
        this.load.image('dialog20', 'assets/images/dialog20.png');
        this.load.image('dialog21', 'assets/images/dialog21.png');
        this.load.image('dialog22', 'assets/images/dialog22.png');
        this.load.image('dialog23', 'assets/images/dialog23.png');
        this.load.image('dialog24', 'assets/images/dialog24.png');
        this.load.image('dialog25', 'assets/images/dialog25.png');
        this.load.image('button1', 'assets/images/button1.png');
        this.load.image('button2', 'assets/images/button2.png');
        this.load.image('skip', 'assets/images/skip.png');
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        this.gameBGM.play();

        // 初始化 dialog 圖片陣列
        this.dialogImages = [
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog17').setOrigin(0.5, 0.5),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog18').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog19').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog20').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog21').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog22').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog23').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog24').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog25').setOrigin(0.5, 0.5).setAlpha(0)
        ];

        // 縮放每個 dialog 圖片以適應螢幕大小，並保持比例
        this.dialogImages.forEach(dialog => {
            this.scaleToFitScreen(dialog);
        });

        // 顯示 skip 按鈕，並確保在最上層
        this.skipImage = this.add.image(1030, 550, 'skip').setDisplaySize(100, 50).setOrigin(0, 0).setInteractive();
        this.skipImage.setDepth(1); // 確保 skip 按鈕在最上層

        // 初始化按鈕
        this.button1 = this.add.image(650, 100, 'button1').setDisplaySize(300, 100).setOrigin(0.5, 0.5).setInteractive();
        this.button2 = this.add.image(650, 250, 'button2').setDisplaySize(300, 100).setOrigin(0.5, 0.5).setInteractive();
        this.button1.setVisible(false).setInteractive(false);
        this.button2.setVisible(false).setInteractive(false);

        this.currentDialogIndex = 0;

        // 設定 skip 按鈕點擊事件
        this.skipImage.on('pointerdown', () => {
            this.showNextDialog();
        });

        // 設定按鈕點擊事件
        this.button1.on('pointerdown', () => {
            this.showDialog24();
        });

        this.button2.on('pointerdown', () => {
            this.showDialog24();
        });
    }

    showNextDialog() {
        if (this.currentDialogIndex < this.dialogImages.length - 1) {
            // 隱藏當前的 dialog 圖片
            this.dialogImages[this.currentDialogIndex].setAlpha(0);
            this.currentDialogIndex++;
            // 顯示下一個 dialog 圖片
            this.dialogImages[this.currentDialogIndex].setAlpha(1);

            if (this.currentDialogIndex === 6) { // 當到達 dialog23 時
                this.skipImage.setVisible(false).setInteractive(false);
                // 延遲 2 秒後顯示按鈕
                this.time.delayedCall(2000, () => {
                    this.button1.setVisible(true).setInteractive(true);
                    this.button2.setVisible(true).setInteractive(true);
                });
            } else {
                this.skipImage.setVisible(true).setInteractive(true);
            }
        } else {
            // 所有對話框顯示完畢
            this.gameBGM.stop(); // 停止背景音樂
            this.scene.start('Scene12'); // 跳轉到下一場景
        }
    }

    showDialog24() {
        this.button1.setVisible(false).setInteractive(false);
        this.button2.setVisible(false).setInteractive(false);
        this.dialogImages[6].setAlpha(0); // 隱藏 dialog23
        this.dialogImages[7].setAlpha(1); // 顯示 dialog24
        this.skipImage.setVisible(true).setInteractive(true);

        this.skipImage.on('pointerdown', () => {
            this.dialogImages[7].setAlpha(0); // 隱藏 dialog24
            this.dialogImages[8].setAlpha(1); // 顯示 dialog25
            this.skipImage.on('pointerdown', () => {
                this.gameBGM.stop(); // 停止背景音樂
                this.scene.start('Scene12');
            });
        });
    }

    scaleToFitScreen(image) {
        // 計算縮放比例，維持圖片原始比例
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY); // 窄邊留白，選擇較小的縮放比例
        image.setScale(scale);
    }
}

export default Scene11;