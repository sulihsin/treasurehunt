class Scene13 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene13' });
    }

    preload() {
        this.load.image('dialog26', 'assets/images/dialog26.png');
        this.load.image('dialog27', 'assets/images/dialog27.png');
        this.load.image('dialog28', 'assets/images/dialog28.png');
        this.load.image('dialog29', 'assets/images/dialog29.png');
        this.load.image('dig', 'assets/images/dig.png');
        this.load.image('skip', 'assets/images/skip.png');
        this.load.image('particle', 'assets/images/particle.png'); // 加載粒子圖片
        this.load.audio('digsound', 'assets/audio/digsound.mp3'); // 加載挖掘音效
        this.load.audio('kin', 'assets/audio/kin.mp3'); // 加載寶箱音效
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            console.error('Scene error, restarting scene:', msg, url, lineNo, columnNo, error);
            this.scene.restart();  // 重新啟動目前這個場景
            return true; // 阻止預設跳回首頁
        };
        
        // Promise rejection 也要處理
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Scene unhandled rejection, restarting scene:', event.reason);
            this.scene.restart();
        });
        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', { volume: 1.2, loop: true });
        this.gameBGM.play();

        // 初始化 dialog 圖片陣列
        this.dialogImages = [
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog26').setOrigin(0.5, 0.5),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog27').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog28').setOrigin(0.5, 0.5).setAlpha(0),
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog29').setOrigin(0.5, 0.5).setAlpha(0)
        ];

        // 縮放每個 dialog 圖片以適應螢幕大小，並保持比例
        this.dialogImages.forEach(dialog => {
            this.scaleToFitScreen(dialog);
        });

        // 計算相對位置和縮放
        this.skipImage = this.add.image(this.scale.width * 0.93, this.scale.height * 0.93, 'skip')
            .setOrigin(0.5, 0.5)
            .setInteractive();

        // 按比例調整skip按鈕大小
        this.skipImage.setDisplaySize(this.scale.width * 0.1, this.scale.height * 0.08);

        // 初始化挖掘按鈕，使用相對位置和畫面比例縮放
        this.digButton = this.add.image(this.scale.width * 0.8, this.scale.height * 0.85, 'dig')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.scale.width * 0.08, this.scale.height * 0.14)
            .setInteractive();

        // 挖掘按鈕初始為不可見且不可互動
        this.digButton.setVisible(false).setInteractive(false);

        // 加載音效
        this.digSound = this.sound.add('digsound');
        this.kinSound = this.sound.add('kin');

        this.currentDialogIndex = 0;
        this.digCount = 0;

        // 初始化挖掘次數顯示
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

        // 設置粒子發射器
        this.particles = this.add.particles('particle');
        this.emitter = this.particles.createEmitter({
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.92,
            speed: { min: this.scale.width * 0.04, max: this.scale.width * 0.1 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.04, end: 0.08 },
            lifespan: 300,
            blendMode: 'normal',
            quantity: 2,
            on: false
        });

        // 設定 skip 按鈕點擊事件
        this.skipImage.on('pointerdown', () => {
            this.showNextDialog();
        });

        // 設定挖掘按鈕點擊事件
        this.digButton.on('pointerdown', () => {
            this.digCount++;
            this.digSound.play();

            // 每10下才顯示一次粒子效果
            if (this.digCount % 10 === 0) {
                // 啟動粒子效果
                this.emitter.setPosition(this.scale.width * 0.47, this.scale.height * 0.9);
                this.emitter.explode(2);
            }

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
            // 隱藏當前的 dialog 圖片
            this.dialogImages[this.currentDialogIndex].setAlpha(0);
            this.currentDialogIndex++;
            // 顯示下一個 dialog 圖片
            this.dialogImages[this.currentDialogIndex].setAlpha(1);

            if (this.currentDialogIndex === 1) { // 當到達 dialog27 時
                this.skipImage.setVisible(false).setInteractive(false);
                this.digButton.setVisible(true).setInteractive(true);

                // 顯示挖掘次數顯示文字
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
        // 計算縮放比例，維持圖片原始比例
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY);
        image.setScale(scale);
    }
}

export default Scene13;