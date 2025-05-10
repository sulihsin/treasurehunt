class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {
        // 加載需要的資源
        for (let i = 1; i <= 20; i++) {
            this.load.image(`puzzle${i}`, `assets/images/puzzle${i}.png`);
        }
        this.load.image('submit', 'assets/images/submit.png');
        this.load.image('outline', 'assets/images/outline.png'); // 加載 outline 圖片
        this.load.image('axis', 'assets/images/axis.png'); // 加載 axis 圖片
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3'); // 加載背景音樂
        this.load.audio('puzzle', 'assets/audio/puzzle.mp3'); // 加載拼圖音效
    }

    create() {
        // 停止所有聲音
        this.sound.stopAll();

        // 播放 Scene1 的背景音樂
        this.bgm = this.sound.add('gameBGM', { volume: 1.5, loop: true }); // 設置背景音樂為單曲循環
        this.bgm.play();

        // 添加 outline 圖片，並將其放置在拼圖塊的下方，但在其他底層元素的上方
        const outline = this.add.image(300, 260, 'outline').setOrigin(0.5).setDisplaySize(400, 320);

        const fixedPieces = [1, 4, 5, 7, 8, 13, 15, 16, 18];
        const positions = [...Array(20).keys()].map(i => i + 1); // [1, 2, ..., 20]
        const fixedPositions = {
            1: { x: 100, y: 100 }, 4: { x: 340, y: 100 }, 5: { x: 420, y: 100 },
            7: { x: 180, y: 180 }, 8: { x: 260, y: 180 }, 13: { x: 260, y: 260 },
            15: { x: 420, y: 260 }, 16: { x: 100, y: 340 }, 18: { x: 260, y: 340 }
        };

        const correctPositions = {
            2: { x: 180, y: 100 }, 3: { x: 260, y: 100 }, 6: { x: 100, y: 180 }, 9: { x: 340, y: 180 }, 10: { x: 420, y: 180 },
            11: { x: 100, y: 260 }, 12: { x: 180, y: 260 }, 14: { x: 340, y: 260 }, 17: { x: 180, y: 340 }, 19: { x: 340, y: 340 },
            20: { x: 420, y: 340 }
        };

        const snapPositions = [
            { x: 180, y: 100 }, { x: 260, y: 100 }, { x: 340, y: 100 }, { x: 100, y: 180 }, { x: 340, y: 180 },
            { x: 420, y: 180 }, { x: 100, y: 260 }, { x: 180, y: 260 }, { x: 340, y: 260 }, { x: 180, y: 340 },
            { x: 340, y: 340 }, { x: 420, y: 340 }
        ];

        // 打亂 positions 陣列，排除固定拼圖塊
        const randomPositions = positions.filter(p => !fixedPieces.includes(p));
        randomPositions.sort(() => Math.random() - 0.5);

        this.puzzles = []; // 用來存儲拼圖塊
        let gridSize = 80; // 縮小拼圖塊大小

        // 放置固定拼圖塊
        for (let pieceNumber of fixedPieces) {
            let { x, y } = fixedPositions[pieceNumber];
            let puzzlePiece = this.add.image(x, y, `puzzle${pieceNumber}`).setOrigin(0, 0);
            puzzlePiece.setDisplaySize(gridSize, gridSize); // 縮小拼圖塊
            this.puzzles.push({ pieceNumber, puzzlePiece, fixed: true });
        }

        // 遍歷 randomPositions 並放置可移動拼圖塊在右邊
        let puzzleIndex = 0;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                if (!fixedPositions[1 + col + row * 5]) {
                    let pieceNumber = randomPositions[puzzleIndex++];
                    let x = 600 + col * gridSize + (Math.random() * 20 - 10); // 放在右邊並隨機偏移
                    let y = 100 + row * gridSize + (Math.random() * 20 - 10);

                    let puzzlePiece = this.add.image(x, y, `puzzle${pieceNumber}`).setOrigin(0, 0).setInteractive();
                    puzzlePiece.setDisplaySize(gridSize, gridSize); // 縮小拼圖塊
                    this.input.setDraggable(puzzlePiece);
                    this.puzzles.push({ pieceNumber, puzzlePiece, fixed: false });
                }
            }
        }

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            let closest = null;
            let minDist = Infinity;

            for (let pos of snapPositions) {
                let dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, pos.x, pos.y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = pos;
                }
            }

            if (minDist < 40) { // 設定吸附距離閾值
                gameObject.x = closest.x;
                gameObject.y = closest.y;

                // 撥放拼圖音效
                this.sound.play('puzzle', { volume: 1.2 });
            }
        });

        // 提交按鈕，用於檢查拼圖是否正確
        this.submitButton = this.add.image(600, 500, 'submit').setInteractive();
        this.submitButton.on('pointerdown', () => this.checkSolution());

        // 添加縮放支持
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const cam = this.cameras.main;
            cam.zoom -= deltaY * 0.001;
            cam.zoom = Phaser.Math.Clamp(cam.zoom, 0.5, 2);
        });

        // 添加 axis 圖片，並將其放置在最上層
        const axis = this.add.image(290, 275, 'axis').setOrigin(0.5).setDisplaySize(460, 380);
        this.axis = axis; // 保存 axis 圖片的引用，以便後續操作
    }

    checkSolution() {
        const correctPositions = {
            1: { x: 100, y: 100 }, 2: { x: 180, y: 100 }, 3: { x: 260, y: 100 }, 4: { x: 340, y: 100 }, 5: { x: 420, y: 100 },
            6: { x: 100, y: 180 }, 7: { x: 180, y: 180 }, 8: { x: 260, y: 180 }, 9: { x: 340, y: 180 }, 10: { x: 420, y: 180 },
            11: { x: 100, y: 260 }, 12: { x: 180, y: 260 }, 13: { x: 260, y: 260 }, 14: { x: 340, y: 260 }, 15: { x: 420, y: 260 },
            16: { x: 100, y: 340 }, 17: { x: 180, y: 340 }, 18: { x: 260, y: 340 }, 19: { x: 340, y: 340 }, 20: { x: 420, y: 340 }
        };
        let isCorrect = true;

        for (let i = 0; i < this.puzzles.length; i++) {
            let { pieceNumber, puzzlePiece } = this.puzzles[i];
            let correctPosition = correctPositions[pieceNumber];

            if (puzzlePiece.x !== correctPosition.x || puzzlePiece.y !== correctPosition.y) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            let password = prompt("密碼提示：(1,3)(2,1)(4,3)，請輸入拼圖中隱藏的密碼：");
            if (password === "三角湧") { // 替換成你設定的正確密碼
                this.bgm.stop(); // 停止背景音樂
                this.scene.start('Scene7');
            } else {
                alert("密碼錯誤！");
            }
        } else {
            alert("拼圖不正確！");
        }
    }
}

export default Scene1;