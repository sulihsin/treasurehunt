class Scene13 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene13' });
    }

    preload() {
        // 監聽資源載入失敗（任一資源失敗時就重啟本場景）
        this.load.on('loaderror', (file) => {
            console.warn('[Scene13] Resource load failed:', file.key, file.src);
            // 用 setTimeout 防止連鎖錯誤造成無限重啟
            setTimeout(() => {
                this.scene.restart();
            }, 500);
        });

        this.load.image('dialog26', 'assets/images/dialog26.png');
        this.load.image('dialog27', 'assets/images/dialog27.png');
        this.load.image('dialog28', 'assets/images/dialog28.png');
        this.load.image('dialog29', 'assets/images/dialog29.png');
        this.load.image('dig', 'assets/images/dig.png');
        this.load.image('skip', 'assets/images/skip.png');
        this.load.audio('digsound', 'assets/audio/digsound.mp3');
        this.load.audio('kin', 'assets/audio/kin.mp3');
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3');
    }

    create() {
        // ... 你的 create 內容完全不變 ...
        this.gameBGM = this.sound.add('gameBGM', { volume: 1.2, loop: true });
        this.gameBGM.play();

        this.dialogImages = [
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog26').setOrigin(0.5, 0.5),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog27').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog28').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog29').setOrigin(0.5, 0.5).setAlpha(0)
        ];

        this.dialogImages.forEach(dialog => {
            this.scaleToFitScreen(dialog);
        });

        this.skipImage = this.add.image(this.scale.width * 0.93, this.scale.height * 0.93, 'skip')
            .setOrigin(0.5, 0.5)
            .setInteractive();

        this.skipImage.setDisplaySize(this.scale.width * 0.1, this.scale.height * 0.08);

        this.digButton = this.add.image(this.scale.width * 0.8, this.scale.height * 0.85, 'dig')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.scale.width * 0.08, this.scale.height * 0.14)
            .setInteractive();

        this.digButton.setVisible(false).setInteractive(false);

        this.digSound = this.sound.add('digsound');
        this.kinSound = this.sound.add('kin');

        this.currentDialogIndex = 0;
        this.digCount = 0;

        this.digCounterText = this.add.text(this.scale.width * 0.9, this.scale.height * 0.8, `x100`, {
            fontSize: `${Math.floor(this.scale.width * 0.03)}px`,
            color: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            fixedWidth: this.scale.width * 0.1,
            align: 'center',
            padding: { top: 5, bottom: 5, left: 5, right: 5 }
        }).setOrigin(0.5, 0.5).setVisible(false);

        this.currentCounterPosition = {
            x: this.scale.width * 0.9,
            y: this.scale.height * 0.8
        };

        this.skipImage.on('pointerdown', () => {
            this.showNextDialog();
        });

        this.digButton.on('pointerdown', () => {
            this.digCount++;
            this.digSound.play();

            const remaining = 100 - this.digCount;
            this.digCounterText.setText(`x${remaining}`);
            if (remaining > 0) {
                this.digCounterText.setVisible(true);
            }

            if (this.digCount >= 100) {
                this.kinSound.play({ volume: 1.2 });
                this.showNextDialog();
            }
        });
    }

    showNextDialog() {
        if (this.currentDialogIndex < this.dialogImages.length - 1) {
            this.dialogImages[this.currentDialogIndex].setAlpha(0);
            this.currentDialogIndex++;
            this.dialogImages[this.currentDialogIndex].setAlpha(1);

            if (this.currentDialogIndex === 1) {
                this.skipImage.setVisible(false).setInteractive(false);
                this.digButton.setVisible(true).setInteractive(true);

                this.digCounterText.setVisible(true);
                this.digCounterText.setPosition(this.currentCounterPosition.x, this.currentCounterPosition.y);
            } else {
                this.skipImage.setVisible(true).setInteractive(true);
                this.digButton.setVisible(false).setInteractive(false);
                this.digCounterText.setVisible(false);
            }
        } else {
            this.gameBGM.stop();
            this.scene.start('Scene14');
        }
    }

    scaleToFitScreen(image) {
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY);
        image.setScale(scale);
    }
}

export default Scene13;