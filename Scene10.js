class Scene10 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene10' });
    }

    preload() {
        this.load.image('grass', 'assets/images/grass.png'); // 加載背景圖片
        for (let i = 1; i <= 30; i++) { // 加載花的圖片，擴展到 flower30
            this.load.image(`flower${i}`, `assets/images/flower${i}.png`);
        }
        this.load.image('skip', 'assets/images/skip.png');
        this.load.audio('plant', 'assets/audio/plant.mp3'); // 加載正確答案音效
        this.load.audio('wrong', 'assets/audio/wrong.mp3'); // 加載錯誤答案音效
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', {volume: 1.5, loop: true });
        this.gameBGM.play();

        // 添加背景圖片
        const grassImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'grass')
            .setOrigin(0.5, 0.5);
        this.scaleToFitScreen(grassImage); // 縮放圖片到螢幕大小並置中

        this.correctAnswers = new Set([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]); // 正確答案的編號
        this.currentSet = 1;
        this.totalSets = 2;
        this.currentCorrectCount = 0;
        this.plantSound = this.sound.add('plant'); // 創建正確答案音效對象
        this.wrongSound = this.sound.add('wrong'); // 創建錯誤答案音效對象
        this.showFlowers();
    }

    scaleToFitScreen(image) {
        // 計算縮放比例，維持圖片原始比例
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY); // 窄邊留白，選擇較小的縮放比例
        image.setScale(scale);
    }

    showFlowers() {
        const start = (this.currentSet - 1) * 10 + 1; // 每輪顯示 10 個原始花選項
        const end = this.currentSet * 10;
        const additionalStart = 21; // 新增的錯誤選項從 flower21 開始
        const additionalEnd = additionalStart + this.currentSet * 5 - 1; // 每輪新增 5 個錯誤選項
        this.flowerImages = [];
        
        for (let i = start; i <= end; i++) {
            this.createFlower(i);
        }

        for (let i = additionalStart; i <= additionalEnd; i++) {
            this.createFlower(i);
        }
    }

    createFlower(index) {
        let x, y, flower, overlap;
        do {
            x = Phaser.Math.Between(this.cameras.main.width / 2 - 400, this.cameras.main.width / 2 + 400); // 限制左右範圍
            y = Phaser.Math.Between(this.cameras.main.height / 2 - 250, this.cameras.main.height / 2 + 250); // 限制上下範圍
            overlap = false;
            for (let otherFlower of this.flowerImages) {
                if (Phaser.Math.Distance.Between(x, y, otherFlower.x, otherFlower.y) < 100) { // 距離至少 100 像素
                    overlap = true;
                    break;
                }
            }
        } while (overlap);
        
        flower = this.add.image(x, y, `flower${index}`).setInteractive();
        flower.correct = this.correctAnswers.has(index);
        flower.on('pointerdown', () => {
            if (flower.correct) {
                this.handleCorrectAnswer(flower);
            } else {
                this.playSound('wrong'); // 播放錯誤答案音效
            }
        });
        this.flowerImages.push(flower);
    }

    handleCorrectAnswer(flower) {
        this.playSound('plant'); // 播放正確答案音效
        this.tweens.add({
            targets: flower,
            scale: 1.2,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                flower.destroy();
                this.currentCorrectCount++;
                if (this.currentCorrectCount === 5) {
                    if (this.currentSet < this.totalSets) {
                        this.currentSet++;
                        this.currentCorrectCount = 0;
                        this.clearFlowers();
                        this.showFlowers();
                    } else {
                        this.showSkipButton();
                    }
                }
            },
        });
    }

    clearFlowers() {
        this.flowerImages.forEach(flower => flower.destroy());
        this.flowerImages = [];
    }

    showSkipButton() {
        const skipButton = this.add.image(1030, 550, 'skip').setInteractive();
        skipButton.on('pointerdown', () => {
            this.gameBGM.stop(); // 停止背景音樂
            this.scene.start('Scene11');
        });
    }

    playSound(soundKey) {
        if (soundKey === 'plant') {
            if (this.wrongSound.isPlaying) {
                this.wrongSound.stop();
            }
            this.plantSound.play();
        } else if (soundKey === 'wrong') {
            if (this.plantSound.isPlaying) {
                this.plantSound.stop();
            }
            this.wrongSound.play();
        }
    }
}

export default Scene10;