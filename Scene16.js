class Scene16 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene16' });
    }

    preload() {
        this.load.image('skip', 'assets/images/skip.png');
        this.load.image('wood', 'assets/images/wood.PNG'); // 加載新的 wood 圖片
        for (let i = 1; i <= 26; i++) {
            this.load.image(`letter${i}`, `assets/images/letter${i}.png`);
        }
        this.load.audio('ling', 'assets/audio/ling.mp3'); // 加載 ling.mp3 音效
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        this.gameBGM.play();

        // 添加新的 wood 圖片並維持比例縮放到螢幕大小並置中
        const woodImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'wood')
            .setOrigin(0.5, 0.5);
        this.scaleToFitScreen(woodImage);

        // 定義正確密碼
        this.correctPassword = [25, 15, 21]; // 對應 YOU (Y=25, O=15, U=21)
        this.currentPassword = [1, 1, 1]; // 初始為 letter1 (A)
        this.passwordImages = [];
        this.isPasswordLocked = false; // 鎖定狀態，初始為 false

        // 可配置的密碼位置和縮放
        const passwordConfig = {
            startX: this.cameras.main.width / 2.06 - 75, // 起始 X 位置
            startY: this.cameras.main.height / 1.17, // 起始 Y 位置
            spacing: 67, // 每個密碼之間的間距
            scale: 0.8, // 縮放大小
        };

        // 顯示密碼圖片
        for (let i = 0; i < 3; i++) {
            let x = passwordConfig.startX + i * passwordConfig.spacing;
            let y = passwordConfig.startY;
            let image = this.add.image(x, y, 'letter1').setInteractive().setScale(passwordConfig.scale);
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
        this.currentPassword[index] = (this.currentPassword[index] % 26) + 1; // 循環顯示 letter1 到 letter26
        this.passwordImages[index].setTexture(`letter${this.currentPassword[index]}`);

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
    this.scale.width * 0.5, // 畫面寬度的 50%（相對水平位置）
    this.scale.height * 0.5, // 畫面高度的 50%（相對垂直位置）
    '密碼正確！', {
        fontSize: `${this.scale.width * 0.04}px`, // 按畫面寬度的 4% 設定字體大小
        color: '#00FF00',
        fontStyle: 'bold',
        align: 'center', // 確保文字對齊
        backgroundColor: '#000000', // 添加背景色以便更清晰
        padding: {
            top: this.scale.height * 0.01, // 內邊距按畫面高度的 1% 設定
            bottom: this.scale.height * 0.01,
            left: this.scale.width * 0.02, // 內邊距按畫面寬度的 2% 設定
            right: this.scale.width * 0.01,
        }, // 增加內邊距避免文字被裁剪
    }
).setOrigin(0.5, 0.5); // 設定原點為中心，確保文字以中心對齊
    
        // 確保文字顯示在場景的最上層
        successText.setDepth(10);
    
        // 鎖定密碼，防止再撥動
        this.isPasswordLocked = true;

        // 倒數3秒後跳轉到 Scene17
        this.time.delayedCall(3000, () => {
            this.gameBGM.stop(); // 停止背景音樂
            this.scene.start('Scene17');
        });
    }
}

export default Scene16;