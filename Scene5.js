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

        // 計算相對位置和縮放
this.skipImage = this.add.image(this.scale.width * 0.93, this.scale.height * 0.93, 'skip')
.setOrigin(0.5, 0.5) // 設置圖片的原點為中心
.setInteractive();

// 計算按鈕的大小，根據螢幕寬高比例進行縮放
this.skipImage.setDisplaySize(this.scale.width * 0.1, this.scale.height * 0.08); // 按比例調整大小

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
        // 顯示地圖，放置於左下角，長邊佔畫面 80%，保持比例
        const mapImage = this.add.image(0, this.scale.height, 'map').setOrigin(0, 1); // 左下角對齊
    
        // 計算縮放比例，長邊佔畫面 94%，短邊留白
        const scaleX = (this.scale.width * 0.94) / mapImage.width;
        const scaleY = (this.scale.height * 0.94) / mapImage.height;
        const scale = Math.min(scaleX, scaleY); // 確保原始比例不變
        mapImage.setScale(scale);
    
        // 添加 rule2 圖片
        this.rule2Image = this.add.image(this.scale.width * 0, this.scale.height * 0, 'rule2') // 左上角對齊，使用相對位置
            .setOrigin(0, 0) // 設置圖片的原點 (origin) 為左上角
            .setScale(0.7) // 可調整的縮放比例
            .setDepth(10); // 設置圖層在最上層
    
        // 正確位置的設置
        let correctPositions = {
            'river1': { x: 0.44, y: 0.283 },
            'river2': { x: 0.5, y: 0.267 },
            'river3': { x: 0.073, y: 0.483 },
            'mountain1': { x: 0.041, y: 0.64 },
            'mountain2': { x: 0.6, y: 0.917 },
            'mountain3': { x: 0.44, y: 0.82 },
            'bridge1': { x: 0.36, y: 0.383 },
            'bridge2': { x: 0.39, y: 0.333 },
            'bridge3': { x: 0.31, y: 0.64 },
            'bridge4': { x: 0.315, y: 0.6 },
            'bridge5': { x: 0.32, y: 0.483 },
            'arrow1': { x: 0.56, y: 0.133 },
            'arrow2': { x: 0.74, y: 0.217 },
            'arrow3': { x: 0.486, y: 0.1 },
            'arrow4': { x: 0.12, y: 0.833 },
            'arrow5': { x: 0.03, y: 0.167 },
            'school1': { x: 0.27, y: 0.2 },
            'school2': { x: 0.57, y: 0.3 },
            'spot1': { x: 0.22, y: 0.5 },
            'spot2': { x: 0.26, y: 0.467 },
            'spot3': { x: 0.58, y: 0.367 },
            'spot4': { x: 0.529, y: 0.6 },
            'spot5': { x: 0.125, y: 0.342 },
            'spot6': { x: 0.1, y: 0.25 },
            'spot7': { x: 0.37, y: 0.55 },
            'spot8': { x: 0.62, y: 0.28 },
        };
    
        // 當正確配對完成時隱藏 rule2 圖片
        const onComplete = () => {
            if (correctCount === totalItems) {
                this.rule2Image.setVisible(false); // 隱藏 rule2
            }
        };
    
        // 創建 mask 圖片
        let masks = {};
        let correctCount = 0; // 用於計數正確放置的圖片數量
        const totalItems = Object.keys(correctPositions).length; // 總共需要正確放置的圖片數量
    
        for (let key in correctPositions) {
            let pos = correctPositions[key];
            // 計算基於螢幕的絕對座標
            const absoluteX = this.scale.width * pos.x;
            const absoluteY = this.scale.height * pos.y;
    
            // 創建 mask 圖片，放置在正確位置
            masks[key] = this.add.image(absoluteX, absoluteY, 'mask')
                .setOrigin(0.5, 0.5)
                .setAlpha(0.5);
        }

       // 創建可拖曳的圖片
const draggableItems = [
    { key: 'river1', x: 0.82, y: 0.1, scale: 0.5 },
    { key: 'river2', x: 0.82, y: 0.17, scale: 0.5 },
    { key: 'river3', x: 0.82, y: 0.24, scale: 0.5 },
    { key: 'mountain1', x: 0.82, y: 0.31, scale: 0.5 },
    { key: 'mountain2', x: 0.82, y: 0.38, scale: 0.5 },
    { key: 'mountain3', x: 0.82, y: 0.45, scale: 0.5 },
    { key: 'bridge1', x: 0.82, y: 0.52, scale: 0.5 },
    { key: 'bridge2', x: 0.82, y: 0.59, scale: 0.5 },
    { key: 'bridge3', x: 0.82, y: 0.66, scale: 0.5 },
    { key: 'bridge4', x: 0.82, y: 0.73, scale: 0.5 },
    { key: 'bridge5', x: 0.82, y: 0.8, scale: 0.5 },
    { key: 'arrow1', x: 0.82, y: 0.87, scale: 0.5 },
    { key: 'arrow2', x: 0.82, y: 0.94, scale: 0.5 },
    { key: 'arrow3', x: 0.92, y: 0.1, scale: 0.5 },
    { key: 'arrow4', x: 0.92, y: 0.17, scale: 0.5 },
    { key: 'arrow5', x: 0.92, y: 0.24, scale: 0.5 },
    { key: 'school1', x: 0.92, y: 0.31, scale: 0.5 },
    { key: 'school2', x: 0.92, y: 0.38, scale: 0.5 },
    { key: 'spot1', x: 0.92, y: 0.45, scale: 0.5 },
    { key: 'spot2', x: 0.92, y: 0.52, scale: 0.5 },
    { key: 'spot3', x: 0.92, y: 0.59, scale: 0.5 },
    { key: 'spot4', x: 0.92, y: 0.66, scale: 0.5 },
    { key: 'spot5', x: 0.92, y: 0.73, scale: 0.5 },
    { key: 'spot6', x: 0.92, y: 0.8, scale: 0.5 },
    { key: 'spot7', x: 0.92, y: 0.87, scale: 0.5 },
    { key: 'spot8', x: 0.92, y: 0.94, scale: 0.5 },
];

draggableItems.forEach(item => {
    // 計算圖片絕對初始位置
    let originalX = this.scale.width * item.x;
    let originalY = this.scale.height * item.y;

    // 創建圖片
    let image = this.add.image(originalX, originalY, item.key)
        .setScale(item.scale)
        .setOrigin(0.5, 0.5)
        .setInteractive();
    this.input.setDraggable(image);

    // 拖曳事件
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

        // 計算正確位置的絕對座標
        const correctX = this.scale.width * correctPosition.x;
        const correctY = this.scale.height * correctPosition.y;

        // 使用 Phaser 的物理系統進行重疊檢測
        if (Phaser.Geom.Intersects.RectangleToRectangle(image.getBounds(), mask.getBounds())) {
            // 吸附到正確位置
            image.x = correctX;
            image.y = correctY;
            correctCount++; // 增加正確放置的圖片數量
            this.playSound('correct'); // 播放正確音效

            // 禁用該圖片的拖曳功能
            image.disableInteractive();

            // 隱藏對應的 mask
            mask.setVisible(false);

            // 檢查是否所有圖片都已正確放置
            if (correctCount === totalItems) {
                this.skipImage.setVisible(true); // 顯示 skip 按鈕
                onComplete(); // 呼叫完成函數
            }
        } else {
            // 恢復到原始位置
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