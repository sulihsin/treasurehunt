class Scene17 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene17' });
    }

    preload() {
        // 加載所需的資源
        this.load.image('woodopen', 'assets/images/woodopen.PNG');
        this.load.image('dialog33', 'assets/images/dialog33.png');
        this.load.image('mirror', 'assets/images/mirror.PNG');
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設置單曲循環
        const bgm = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        
        // 背景音樂僅在顯示 dialog33 時播放
        bgm.stop(); // 確保音樂在場景開始時未播放

        // 顯示 woodopen 圖片
        const woodopenImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'woodopen')
            .setOrigin(0.5, 0.5)
            .setAlpha(0);
        this.scaleToFitScreen(woodopenImage);

        // 漸進出現 woodopen
        this.tweens.add({
            targets: woodopenImage,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // 停留 2 秒後漸進淡出
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: woodopenImage,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            // 顯示 mirror 圖片
                            const mirrorImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mirror')
                                .setOrigin(0.5, 0.5)
                                .setAlpha(0);
                            this.scaleToFitScreen(mirrorImage);

                            // 漸進出現 mirror
                            this.tweens.add({
                                targets: mirrorImage,
                                alpha: 1,
                                duration: 1000,
                                ease: 'Power2',
                                onComplete: () => {
                                    // 停留 3 秒後漸進淡出
                                    this.time.delayedCall(3000, () => {
                                        this.tweens.add({
                                            targets: mirrorImage,
                                            alpha: 0,
                                            duration: 1000,
                                            ease: 'Power2',
                                            onComplete: () => {
                                                // 顯示 dialog33 圖片
                                                const dialog33Image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog33')
                                                    .setOrigin(0.5, 0.5);
                                                this.scaleToFitScreen(dialog33Image);

                                                // 播放背景音樂
                                                bgm.play();

                                                // dialog33 不會消失，停留在畫面上
                                            },
                                        });
                                    });
                                },
                            });
                        },
                    });
                });
            },
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

export default Scene17;