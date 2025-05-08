class Scene6 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene6' });
    }

    preload() {
        // 加載需要的資源
        this.load.image('dialog3', 'assets/images/dialog3.png');
        this.load.image('dialog4', 'assets/images/dialog4.png');
        this.load.image('skip', 'assets/images/skip.png');
    }

    create() {
        // 顯示 dialog3 圖片，維持比例並縮放到螢幕大小
        let dialog3Image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog3').setOrigin(0.5, 0.5);
        this.scaleToFitScreen(dialog3Image);
        dialog3Image.setAlpha(0); // 初始透明

        // 顯示 skip 按鈕，並確保在最上層
        this.skipImage = this.add.image(1030, 550, 'skip').setDisplaySize(100, 50).setOrigin(0, 0).setInteractive();
        this.skipImage.setDepth(1); // 確保 skip 按鈕在最上層

        // 漸漸浮現效果
        this.tweens.add({
            targets: dialog3Image,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.skipImage.on('pointerdown', () => {
                    dialog3Image.destroy();
                    this.skipImage.off('pointerdown');
                    this.showDialog4();
                });
            }
        });
    }

    showDialog4() {
        // 顯示 dialog4 圖片，維持比例並縮放到螢幕大小
        let dialog4Image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog4').setOrigin(0.5, 0.5);
        this.scaleToFitScreen(dialog4Image);
        dialog4Image.setAlpha(0); // 初始透明

        // 隱藏 skip 按鈕
        this.skipImage.setVisible(false);

        // 漸漸浮現效果
        this.tweens.add({
            targets: dialog4Image,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.skipImage.setVisible(true); // 顯示 skip 按鈕
                this.skipImage.setDepth(1); // 確保 skip 按鈕在最上層
                this.skipImage.on('pointerdown', () => {
                    dialog4Image.destroy();
                    this.skipImage.off('pointerdown');
                    this.scene.start('Scene1'); // 切換到 Scene1
                });
            }
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

export default Scene6;