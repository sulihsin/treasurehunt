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
         .setOrigin(0.5, 0.5) // 設置圖片的原點為中心
         .setInteractive();

         // 計算按鈕的大小，根據螢幕寬高比例進行縮放
         this.skipImage.setDisplaySize(this.scale.width * 0.1, this.scale.height * 0.08); // 按比例調整大小


        // 初始化挖掘按鈕，使用相對位置和畫面比例縮放
this.digButton = this.add.image(this.scale.width * 0.8, this.scale.height * 0.85, 'dig') // 使用相對位置
.setOrigin(0.5, 0.5) // 設置中心為原點
.setDisplaySize(this.scale.width * 0.08, this.scale.height * 0.14) // 按比例縮放大小
.setInteractive(); // 設置可互動

// 初始化為不可見且不可互動
this.digButton.setVisible(false).setInteractive(false);

        // 加載音效
        this.digSound = this.sound.add('digsound'); // 創建挖掘音效對象
        this.kinSound = this.sound.add('kin'); // 創建寶箱音效對象

        this.currentDialogIndex = 0;
        this.digCount = 0;

        // 初始化挖掘次數顯示
this.digCounterText = this.add.text(this.scale.width * 0.9, this.scale.height * 0.8, `x100`, { // 一開始顯示 x100
    fontSize: `${Math.floor(this.scale.width * 0.03)}px`, // 按比例設置字體大小
    color: '#ffffff',
    fontStyle: 'bold',
    backgroundColor: '#000000',
    fixedWidth: this.scale.width * 0.1, // 固定寬度，按比例設置
    align: 'center', // 文字置中
    padding: { top: 5, bottom: 5, left: 5, right: 5 }
}).setOrigin(0.5, 0.5).setVisible(false); // 初始為隱藏

this.currentCounterPosition = { 
    x: this.scale.width * 0.9, 
    y: this.scale.height * 0.8 
}; // 可調整相對位置

// 設置粒子發射器
this.particles = this.add.particles('particle');
this.emitter = this.particles.createEmitter({
    x: this.scale.width * 0.5, // 初始粒子效果中心 x 坐標（相對位置）
    y: this.scale.height * 0.92, // 初始粒子效果中心 y 坐標（相對位置）
    speed: { min: this.scale.width * 0.04, max: this.scale.width * 0.1 }, // 按比例設置粒子速度
    angle: { min: 0, max: 360 }, // 粒子發射角度
    scale: { start: 0.04, end: 0.08 }, // 按比例設置粒子縮放大小
    lifespan: 300, // 粒子存活時間
    blendMode: 'normal', // 混合模式
    quantity: 12, // 每次發射的粒子數量
    on: false // 初始設置為不發射
});

// 設定 skip 按鈕點擊事件
this.skipImage.on('pointerdown', () => {
    this.showNextDialog();
});

// 設定挖掘按鈕點擊事件
this.digButton.on('pointerdown', () => {
    this.digCount++;
    this.digSound.play(); // 播放挖掘音效

    // 啟動粒子效果
    this.emitter.setPosition(this.scale.width * 0.47, this.scale.height * 0.9); // 更新粒子效果的位置
    this.emitter.explode(2); // 在新的位置觸發粒子效果，數量為 12

    const remaining = 100 - this.digCount;
    this.digCounterText.setText(`x${remaining}`);
    if (remaining > 0) {
        this.digCounterText.setVisible(true); // 當剩餘次數大於 0 時顯示
    }

    if (this.digCount >= 100) {
        this.sound.stopAll(); // 停止所有當前音效
        this.kinSound.play({ volume: 1.2 }); // 播放寶箱音效
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
            this.gameBGM.stop(); // 停止背景音樂
            this.scene.start('Scene14');
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

export default Scene13;