class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {
        this.load.image('reset', 'assets/images/reset.png');
        this.load.image('undo', 'assets/images/undo.png');
        this.load.image('win', 'assets/images/win.png');
        this.load.image('rec', 'assets/images/rec.png');
        this.load.image('rule', 'assets/images/rule.png');

        for (let i = 1; i <= 5; i++) {
            this.load.image(`tea${i}`, `images/tea${i}.png`);
        }

        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
    }

    create() {
        // 播放背景音樂並設定為循環
        this.bgm = this.sound.add('gameBGM', { volume: 1.5, loop: true });
        this.bgm.play();

        this.initialBoard = [
            [0, 2, 0, 0, 0],
            [0, 0, 5, 0, 0],
            [3, 0, 0, 0, 4],
            [0, 0, 3, 0, 0],
            [0, 0, 0, 2, 0]
        ];

        this.solution = [
            [5, 2, 4, 3, 1],
            [1, 3, 5, 4, 2],
            [3, 1, 2, 5, 4],
            [2, 4, 3, 1, 5],
            [4, 5, 1, 2, 3]
        ];

        this.board = JSON.parse(JSON.stringify(this.initialBoard)); // 複製初始棋盤
        this.teaImages = [];
        this.selectedTea = 1;

        // 不同區塊的顏色
        const blockColors = [
            [0xffccbc, 0xffccbc, 0xffccbc, 0x90caf9, 0xc8e6c9],
            [0xffccbc, 0xc8e6c9, 0xc8e6c9, 0x90caf9, 0xc8e6c9],
            [0xffccbc, 0xc8e6c9, 0x90caf9, 0x90caf9, 0xc8e6c9],
            [0xc8e6c9, 0xc8e6c9, 0xffe0b2, 0x90caf9, 0xc8e6c9],
            [0xffe0b2, 0xffe0b2, 0xffe0b2, 0xffe0b2, 0xc8e6c9]
        ];

        // 添加圖片在頂層
        let recImage = this.add.image(250, 100, 'rec').setDisplaySize(460, 460).setOrigin(0, 0);
        recImage.setDepth(10); // 設置圖片在最上層
        let ruleImage = this.add.image(130, 20, 'rule').setDisplaySize(750, 51).setOrigin(0, 0);

        let gridSize = 90;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                // 設置區塊顏色
                let tile = this.add.rectangle(300 + col * gridSize, 150 + row * gridSize, 90, 90, blockColors[row][col])
                    .setStrokeStyle(2, 0x000000)
                    .setInteractive();

                tile.row = row;
                tile.col = col;

                // 如果是預設數字，顯示對應茶圖片
                if (this.initialBoard[row][col] !== 0) {
                    let teaSprite = this.add.image(tile.x, tile.y, `tea${this.initialBoard[row][col]}`).setDisplaySize(60, 60); // 保留圖像的原始比例
                    this.board[row][col] = this.initialBoard[row][col];
                } else {
                    tile.on('pointerdown', () => {
                        // 無論格子是否已有答案，皆可更新答案
                        if (this.board[row][col] !== 0) {
                            // 刪除舊的茶圖片
                            let existingTeaImage = this.teaImages.find(img => img.row === row && img.col === col);
                            if (existingTeaImage) {
                                existingTeaImage.sprite.destroy();
                                this.teaImages = this.teaImages.filter(img => img !== existingTeaImage);
                            }
                        }
                        this.board[row][col] = this.selectedTea;
                        let teaSprite = this.add.image(tile.x, tile.y, `tea${this.selectedTea}`).setDisplaySize(60, 60); // 保留圖像的原始比例
                        this.teaImages.push({ row, col, sprite: teaSprite });
                        this.checkSolution(); // 每次移動後調用checkSolution
                    });
                }
            }
        }

        // 茶類選擇按鈕
        for (let i = 1; i <= 5; i++) {
            let teaIcon = this.add.image(800, 100 + i * 80, `tea${i}`).setDisplaySize(70, 70).setInteractive(); // 保留圖像的原始比例
            teaIcon.on('pointerdown', () => {
                this.selectedTea = i;
            });
        }

        // 重來按鈕
        let resetButton = this.add.image(180, 200, 'reset').setDisplaySize(59, 85).setInteractive();
        resetButton.on('pointerdown', () => {
            this.resetBoard();
        });

        // 復原按鈕
        let undoButton = this.add.image(180, 480, 'undo').setDisplaySize(59, 85).setInteractive();
        undoButton.on('pointerdown', () => {
            this.undoMove();
        });

        // 添加縮放支持
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const cam = this.cameras.main;
            cam.zoom -= deltaY * 0.001;
            cam.zoom = Phaser.Math.Clamp(cam.zoom, 0.5, 2);
        });
    }

    checkSolution() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.board[row][col] === 0 || this.board[row][col] !== this.solution[row][col]) {
                    return; // 如果有一個格子未填或不正確則退出
                }
            }
        }
        this.bgm.stop(); // 停止背景音樂
        this.scene.start('Scene8');
    }

    resetBoard() {
        this.board = JSON.parse(JSON.stringify(this.initialBoard));
        this.teaImages.forEach(img => img.sprite.destroy());
        this.teaImages = [];
    }

    undoMove() {
        let lastMove = this.teaImages.pop();
        if (lastMove) {
            this.board[lastMove.row][lastMove.col] = 0;
            lastMove.sprite.destroy();
        }
    }

    update() { }
}

export default Scene2;