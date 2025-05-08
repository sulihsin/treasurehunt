class Scene5 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene5' });
    }

    preload() {
        // 加載需要的資源
        this.load.image('dialog1', 'assets/images/dialog1.png');
        this.load.image('dialog2', 'assets/images/dialog2.png');
        this.load.image('map', 'assets/images/map.PNG');
        this.load.image('skip', 'assets/images/skip.png');
        this.load.image('river1', 'assets/images/river1.png');
        this.load.image('river2', 'assets/images/river2.png');
        this.load.image('river3', 'assets/images/river3.png');
        this.load.image('mountain1', 'assets/images/mountain1.png');
        this.load.image('mountain2', 'assets/images/mountain2.png');
        this.load.image('mountain3', 'assets/images/mountain3.png');
        this.load.image('bridge1', 'assets/images/bridge1.png');
        this.load.image('bridge2', 'assets/images/bridge2.png');
        this.load.image('bridge3', 'assets/images/bridge3.png');
        this.load.image('bridge4', 'assets/images/bridge4.png');
        this.load.image('bridge5', 'assets/images/bridge5.png');
        this.load.image('arrow1', 'assets/images/arrow1.png');
        this.load.image('arrow2', 'assets/images/arrow2.png');
        this.load.image('arrow3', 'assets/images/arrow3.png');
        this.load.image('arrow4', 'assets/images/arrow4.png');
        this.load.image('arrow5', 'assets/images/arrow5.png');
        this.load.image('school1', 'assets/images/school1.png');
        this.load.image('school2', 'assets/images/school2.png');
        this.load.image('spot1', 'assets/images/spot1.png');
        this.load.image('spot2', 'assets/images/spot2.png');
        this.load.image('spot3', 'assets/images/spot3.png');
        this.load.image('spot4', 'assets/images/spot4.png');
        this.load.image('spot5', 'assets/images/spot5.png');
        this.load.image('spot6', 'assets/images/spot6.png');
        this.load.image('spot7', 'assets/images/spot7.png');
        this.load.image('spot8', 'assets/images/spot8.png');
        this.load.image('mask', 'assets/images/mask.png'); 
        this.load.image('rule2', 'assets/images/rule2.png');
        this.load.audio('correct', 'assets/audio/correct.mp3'); 
        this.load.audio('wrong', 'assets/audio/wrong.mp3'); 
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 加載音效
        this.bgm = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        this.bgm.play();
        this.correctSound = this.sound.add('correct', { volume: 0.08 }); // 預設音量為 0.5
        this.wrongSound = this.sound.add('wrong', { volume: 0.08 }); // 預設音量為 0.5

        // 顯示 dialog1 圖片，維持比例並縮放到螢幕大小
        let dialog1Image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog1').setOrigin(0.5, 0.5);
        this.scaleToFitScreen(dialog1Image);
        dialog1Image.setAlpha(0);

        // 顯示 skip 按鈕
        this.skipImage = this.add.image(1030, 550, 'skip').setDisplaySize(100, 50).setOrigin(0, 0).setInteractive();

        // 漸漸浮現效果
        this.tweens.add({
            targets: dialog1Image,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.skipImage.on('pointerdown', () => {
                    dialog1Image.destroy();
                    this.skipImage.off('pointerdown');
                    this.showDialog2();
                });
            }
        });
    }

    showDialog2() {
        // 顯示 dialog2 圖片，維持比例並縮放到螢幕大小
        let dialog2Image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'dialog2').setOrigin(0.5, 0.5);
        this.scaleToFitScreen(dialog2Image);
        dialog2Image.setAlpha(0);

        // 漸漸浮現效果
        this.tweens.add({
            targets: dialog2Image,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.skipImage.on('pointerdown', () => {
                    dialog2Image.destroy();
                    this.skipImage.off('pointerdown');
                    this.skipImage.setVisible(false); // 隱藏 skip 按鈕
                    this.showMap();
                });
            }
        });
    }

    showMap() {
        // 你可以調整這裡的 x 和 y 參數來更改 map 圖片的位置和大小
        let mapImage = this.add.image(100, 30, 'map').setDisplaySize(762, 571).setOrigin(0, 0);

         // 添加 rule2 圖片
         this.rule2Image = this.add.image(290, 15, 'rule2')
         .setOrigin(0.5, 0.5)
         .setScale(0.8) // 可調整的 scale
         .setDepth(10); // 設置圖層在最上層

        // 正確位置的設置
        let correctPositions = {
            'river1': { x: 550, y: 170 },
            'river2': { x: 620, y: 160 },
            'river3': { x: 172, y: 290 },
            'mountain1': { x: 150, y: 390 },
            'mountain2': { x: 720, y: 550 },
            'mountain3': { x: 550, y: 470 },
            'bridge1': { x: 460, y: 230 },
            'bridge2': { x: 500, y: 200 },
            'bridge3': { x: 410, y: 400 },
            'bridge4': { x: 410, y: 360 },
            'bridge5': { x: 430, y: 290 },
            'arrow1': { x: 670, y: 80 },
            'arrow2': { x: 840, y: 130 },
            'arrow3': { x: 585, y: 60 },
            'arrow4': { x: 220, y: 500 },
            'arrow5': { x: 130, y: 100 },
            'school1': { x: 370, y: 110 },
            'school2': { x: 680, y: 180 },
            'spot1': { x: 330, y: 300 },
            'spot2': { x: 370, y: 280 },
            'spot3': { x: 690, y:220 },
            'spot4': { x: 635, y: 360 },
            'spot5': { x: 230, y: 205 },
            'spot6': { x: 195, y: 145 },
            'spot7': { x: 475, y: 330 },
            'spot8': { x: 723, y: 132 },
        };

        // 創建 mask 圖片
        let masks = {};
        let correctCount = 0; // 用於計數正確放置的圖片數量
        const totalItems = Object.keys(correctPositions).length; // 總共需要正確放置的圖片數量
        
        // 當正確配對完成時隱藏 rule2 圖片
        const onComplete = () => {
            if (correctCount === totalItems) {
                this.rule2Image.setVisible(false); // 隱藏 rule2
            }
        };

        for (let key in correctPositions) {
            let pos = correctPositions[key];
            masks[key] = this.add.image(pos.x, pos.y - 10, 'mask').setOrigin(0.5, 0.5).setAlpha(0.5);
        }

        // 創建可拖曳的圖片
        let draggableItems = [
            { key: 'river1', x: 900, y: 80, scale: 0.5 },
            { key: 'river2', x: 900, y: 140, scale: 0.5 },
            { key: 'river3', x: 900, y: 200, scale: 0.5 },
            { key: 'mountain1', x: 900, y: 260, scale: 0.5 },
            { key: 'mountain2', x: 900, y: 320, scale: 0.5 },
            { key: 'mountain3', x: 900, y: 380, scale: 0.5 },
            { key: 'bridge1', x: 900, y: 440, scale: 0.5 },
            { key: 'bridge2', x: 900, y: 500, scale: 0.5 },
            { key: 'bridge3', x: 900, y: 560, scale: 0.5 },
            { key: 'bridge4', x: 1050, y: 80, scale: 0.5 },
            { key: 'bridge5', x: 1050, y: 140, scale: 0.5 },
            { key: 'arrow1', x: 1050, y: 200, scale: 0.5 },
            { key: 'arrow2', x: 1050, y: 260, scale: 0.5 },
            { key: 'arrow3', x: 1050, y: 320, scale: 0.5 },
            { key: 'arrow4', x: 1050, y: 380, scale: 0.5 },
            { key: 'arrow5', x: 1050, y: 440, scale: 0.5 },
            { key: 'school1', x: 1050, y: 500, scale: 0.5 },
            { key: 'school2', x: 1050, y: 560, scale: 0.5 },
            { key: 'spot1', x: 1200, y: 80, scale: 0.5 },
            { key: 'spot2', x: 1200, y: 140, scale: 0.5 },
            { key: 'spot3', x: 1200, y: 200, scale: 0.5 },
            { key: 'spot4', x: 1200, y: 260, scale: 0.5 },
            { key: 'spot5', x: 1200, y: 320, scale: 0.5 },
            { key: 'spot6', x: 1200, y: 380, scale: 0.5 },
            { key: 'spot7', x: 1200, y: 440, scale: 0.5 },
            { key: 'spot8', x: 1200, y: 500, scale: 0.5 },
        ];

        draggableItems.forEach(item => {
            // 創建原始位置記錄
            let originalX = item.x;
            let originalY = item.y;

            let image = this.add.image(item.x, item.y, item.key).setScale(item.scale).setInteractive();
            this.input.setDraggable(image);

            image.on('dragstart', () => {
                this.skipImage.setVisible(false); // 隱藏 skip 按鈕
            });

            image.on('drag', (pointer, dragX, dragY) => {
                image.x = dragX;
                image.y = dragY;
            });

            image.on('dragend', (pointer, dragX, dragY) => {
                let correctPosition = correctPositions[item.key];
                let mask = masks[item.key];
                // 使用Phaser的物理系統進行重疊檢測
                if (Phaser.Geom.Intersects.RectangleToRectangle(image.getBounds(), mask.getBounds())) {
                    // 創建一個新的圖片顯示在正確位置
                    let placedImage = this.add.image(correctPosition.x, correctPosition.y, item.key).setScale(item.scale);
                    // 銷毀拖動的圖片和 mask
                    image.destroy();
                    mask.destroy();
                    correctCount++; // 增加正確放置的圖片數量
                    this.playSound('correct'); // 播放正確音效
                    // 檢查是否所有圖片都已正確放置
                    if (correctCount === totalItems) {
                        this.skipImage.setVisible(true); // 顯示 skip 按鈕
                    }
                } else {
                    // 將圖片位置設置回原始位置
                    image.x = originalX;
                    image.y = originalY;
                    this.playSound('wrong'); // 播放錯誤音效
                }
            });
        });

        this.skipImage.on('pointerdown', () => {
            this.scene.start('Scene6'); // 切換到 Scene6
        });
    }

    stopBGM() {
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.stop(); // 停止背景音樂
        }
    }

     scaleToFitScreen(image) {
        // 計算縮放比例，維持圖片原始比例
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY); // 窄邊留白，選擇較小的縮放比例
        image.setScale(scale);
    }

    playSound(soundKey) {
        if (soundKey === 'correct') {
            if (this.wrongSound.isPlaying) {
                this.wrongSound.stop();
            }
            this.correctSound.play();
        } else if (soundKey === 'wrong') {
            if (this.correctSound.isPlaying) {
                this.correctSound.stop();
            }
            this.wrongSound.play();
        }
    }
}

export default Scene5;