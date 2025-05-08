class Scene12 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene12' });
    }

    preload() {
        // 加載拼圖圖片、音效和按鈕資源
        for (let i = 1; i <= 15; i++) {
            this.load.image(`mine${i}`, `assets/images/mine${i}.png`);
        }
        this.load.image('skip', 'assets/images/skip.png');
        this.load.image('dialog251', 'assets/images/dialog251.png');
        this.load.image('backtoschool', 'assets/images/backtoschool.png');
        this.load.audio('ling', 'assets/audio/ling.mp3'); // 播放完成音效
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 背景音樂
        this.load.audio('puzzle', 'assets/audio/puzzle.mp3'); // 拼圖旋轉音效
    }

    create() {
        const ROWS = 3; // 行數
        const COLS = 5; // 列數
        const PUZZLE_COUNT = ROWS * COLS; // 總拼圖數量
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // 播放背景音樂並設置為循環播放
        this.gameBGM = this.sound.add('gameBGM', {volume: 1.3, loop: true });
        this.gameBGM.play();

        // 加載拼圖旋轉音效
        this.puzzleSound = this.sound.add('puzzle');

        this.puzzlePieces = []; // 儲存拼圖塊的資料
        this.isPuzzleLocked = false; // 控制拼圖是否可轉動

        // 計算拼圖塊的大小並保持正方形比例
        const maxPuzzleWidth = this.cameras.main.width * 0.9 / COLS; // 每塊寬度
        const maxPuzzleHeight = this.cameras.main.height * 0.9 / ROWS; // 每塊高度
        const puzzleSize = Math.min(maxPuzzleWidth, maxPuzzleHeight); // 選擇較小的值保持正方形

        const startX = centerX - (puzzleSize * COLS) / 2 + puzzleSize / 2;
        const startY = centerY - (puzzleSize * ROWS) / 2 + puzzleSize / 2;

        // 建立拼圖塊
        for (let i = 0; i < PUZZLE_COUNT; i++) {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const x = startX + col * puzzleSize;
            const y = startY + row * puzzleSize;

            // 加入拼圖塊
            const puzzlePiece = this.add.image(x, y, `mine${i + 1}`)
                .setOrigin(0.5)
                .setDisplaySize(puzzleSize, puzzleSize) // 保持正方形比例
                .setInteractive();

            // 隨機旋轉拼圖塊
            const randomRotation = Phaser.Math.Between(0, 3) * 90; // 0, 90, 180, 270
            puzzlePiece.rotation = Phaser.Math.DegToRad(randomRotation);

            // 點擊拼圖塊旋轉 90 度
            puzzlePiece.on('pointerdown', () => {
                if (!this.isPuzzleLocked) {
                    puzzlePiece.rotation += Phaser.Math.DegToRad(90);
                    this.puzzleSound.play(); // 播放拼圖旋轉音效
                    this.checkComplete(); // 檢查拼圖是否完成
                }
            });

            this.puzzlePieces.push(puzzlePiece); // 儲存拼圖塊
        }

        // 隱藏跳關按鈕，等拼圖完成後顯示
        this.skipImage = this.add.image(1030, 550, 'skip')
            .setDisplaySize(100, 50)
            .setOrigin(0, 0)
            .setInteractive()
            .setVisible(false);

        this.skipImage.on('pointerdown', () => {
            // 停止背景音樂
            this.gameBGM.stop();

            // 隱藏拼圖和按鈕
            this.puzzlePieces.forEach(piece => piece.setVisible(false));
            this.skipImage.setVisible(false);

            // 顯示 dialog251
            const dialog = this.add.image(centerX, centerY, 'dialog251').setOrigin(0.5);
            this.scaleToFitScreen(dialog);

            // 延遲 2 秒後顯示 backtoschool 按鈕
            this.time.delayedCall(2000, () => {
                const backToSchoolButton = this.add.image(centerX, centerY + 200, 'backtoschool')
                    .setOrigin(0.5)
                    .setDisplaySize(180, 60) // 設置按鈕大小
                    .setInteractive()
                    .setDepth(1); // 放在最上層

                backToSchoolButton.on('pointerdown', () => {
                    this.scene.start('Scene13'); // 跳轉到下一關
                });
            });
        });

        // 拼圖完成提示文字
        this.completionText = this.add.text(centerX, centerY, "報紙拼湊完成", {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
            align: 'center',
        }).setOrigin(0.5).setVisible(false);
    }

    checkComplete() {
        // 檢查所有拼圖塊是否已回到初始旋轉角度 (0 度)
        const isComplete = this.puzzlePieces.every(piece => Phaser.Math.RadToDeg(piece.rotation) % 360 === 0);

        if (isComplete) {
            // 播放完成音效，音量設置為原來的 0.1 倍
            this.sound.play('ling', { volume: 0.1 });

            // 顯示提示文字
            this.completionText.setVisible(true);

            // 鎖定拼圖塊，禁止再旋轉
            this.isPuzzleLocked = true;

            // 2 秒後隱藏提示文字
            this.time.delayedCall(2000, () => {
                this.completionText.setVisible(false);
            });

            // 延遲 10 秒後顯示跳關按鈕
            this.time.delayedCall(10000, () => {
                this.skipImage.setVisible(true); // 顯示跳關按鈕
            });
        }
    }

    scaleToFitScreen(image) {
        // 計算縮放比例，維持圖片原始比例
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY); // 較短邊留白，選擇較小的縮放比例
        image.setScale(scale);
    }
}

export default Scene12;