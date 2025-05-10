class Scene14 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene14' });
    }

    preload() {
        this.load.image('skip', 'assets/images/skip.png');
        this.load.image('iron', 'assets/images/iron.PNG'); // 加載新的 iron 圖片
        for (let i = 0; i <= 9; i++) {
            this.load.image(`number${i}`, `assets/images/number${i}.png`);
        }
        this.load.audio('ling', 'assets/audio/ling.mp3'); // 加載 ling.mp3 音效
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        this.gameBGM.play();

        // 添加新的 iron 圖片並維持比例縮放到螢幕大小
        const ironImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'iron')
            .setOrigin(0.5, 0.5);
        this.scaleToFitScreen(ironImage);

        // 定義正確密碼
        this.correctPassword = [2, 0, 1, 0]; // 正確密碼為 2010
        this.currentPassword = [0, 0, 0, 0]; // 初始值為 0000
        this.passwordImages = [];
        this.isPasswordLocked = false; // 鎖定狀態，初始為 false

        // 可配置的密碼位置和縮放
const passwordConfig = {
    startX: this.scale.width * 0.375, // 起始 X 位置，相對於螢幕寬度的 45%
    startY: this.scale.height * 0.88, // 起始 Y 位置，相對於螢幕高度的 88%
    spacing: this.scale.width * 0.045, // 每個密碼之間的間距，相對於螢幕寬度的 5%
    scale: this.scale.width * 0.001, // 縮放大小，按螢幕寬度比例設置
};

        // 顯示密碼圖片
        for (let i = 0; i < 4; i++) {
            let x = passwordConfig.startX + i * passwordConfig.spacing;
            let y = passwordConfig.startY;
            let image = this.add.image(x, y, 'number0').setInteractive().setScale(passwordConfig.scale);
            image.index = i; // 儲存圖片的索引
            this.passwordImages.push(image);

            image.on('pointerdown', () => {
                if (!this.isPasswordLocked) { // 檢查密碼是否被鎖定
                    this.updatePassword(image.index);
                }
            });
        }
    }

    scaleToFitScreen(image) {
        // 計算縮放比例，維持圖片原始比例
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY); // 窄邊留白，選擇較小的縮放比例
        image.setScale(scale);
    }

    updatePassword(index) {
        // 更新按下的密碼位置
        this.currentPassword[index] = (this.currentPassword[index] + 1) % 10;
        this.passwordImages[index].setTexture(`number${this.currentPassword[index]}`);

        // 檢查密碼是否正確
        if (this.checkPassword()) {
            this.showSuccess();
        }
    }

    checkPassword() {
        // 比較當前密碼與正確密碼
        for (let i = 0; i < this.correctPassword.length; i++) {
            if (this.currentPassword[i] !== this.correctPassword[i]) {
                return false;
            }
        }
        return true;
    }

    showSuccess() {
        // 播放 ling.mp3 音效
        this.sound.play('ling', { volume: 0.5 });

       // 顯示密碼正確提示
let successText = this.add.text(
    this.scale.width * 0.5, // 畫面寬度的 50%（中心位置）
    this.scale.height * 0.5, // 畫面高度的 50%（中心位置）
    '密碼正確！', {
        fontSize: `${this.scale.width * 0.04}px`, // 文字大小按畫面寬度的 5% 動態設定
        color: '#00FF00',
        fontStyle: 'bold',
        align: 'center',
        backgroundColor: '#000000', // 添加背景色
        padding: {
            top: this.scale.height * 0.01, // 上方內邊距按畫面高度的 1% 設定
            bottom: this.scale.height * 0.01, // 下方內邊距按畫面高度的 1% 設定
            left: this.scale.width * 0.02, // 左方內邊距按畫面寬度的 2% 設定
            right: this.scale.width * 0.01, // 右方內邊距按畫面寬度的 2% 設定
        }, // 增加內邊距
    }
).setOrigin(0.5, 0.5); // 設定原點為中心

        // 確保文字顯示在場景的最上層
        successText.setDepth(10);

        // 鎖定密碼，防止再撥動
        this.isPasswordLocked = true;

        // 倒數3秒後跳轉到 Scene15
        this.time.delayedCall(3000, () => {
            this.gameBGM.stop(); // 停止背景音樂
            this.scene.start('Scene15');
        });
    }
}

export default Scene14;